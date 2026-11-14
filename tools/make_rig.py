#!/usr/bin/env python3
"""
make_rig.py — split a flat character illustration into animation layers.

Input : one RGB PNG of a character standing on a PURE BLACK background
        (arms away from the body, e.g. the "shrug" pose used by this project).
Output: assets/rig/{body,head,arm-l,arm-r,lids,mouth-closed,mouth-wide}.png (720 px wide,
        all the same canvas size) and rig.json with pivot / anchor positions in percent.

Layers
  arm-l / arm-r  forearm + hand (with a skin "capsule" hidden under the sleeve so it can rotate)
  body           everything else (dress, legs, braids, bows)
  head           hair + face
  lids           skin patches (inpainted) with a lash line  -> blink animation
  mouth-closed   inpainted skin + soft smile                -> default mouth
  mouth-wide     open mouth                                 -> talking animation

The face / eye / mouth coordinates below belong to the bundled character. For another
character, change the constants in the CONFIG section (open the source in an image editor).

Requires: pip install numpy opencv-python scipy pillow
Usage   : python tools/make_rig.py path/to/character.png --out assets/rig
"""
import argparse, json, os
import cv2, numpy as np
from PIL import Image
from scipy import ndimage as ndi

# ---------------------------------------------------------------- CONFIG (source pixels)
EYES = [(448, 243), (560, 243)]        # eye centres
MOUTH = (508, 322)                      # mouth centre
HEAD_PIVOT = (508, 402)                 # neck base
HEAD_BOX = dict(y_max=300, x_min=315, x_max=700)   # hair + ears region that belongs to the head
CHIN_Y, NECK_KEEP_Y = 395, 372          # face dilation limit / body keeps neck pixels below this
CHEEKS = [(420, 300), (598, 300)]
FEET = (508, 1500)
OUT_WIDTH = 720


def build(src, out):
    rgb = np.array(Image.open(src).convert('RGB'))
    Hh, Ww = rgb.shape[:2]
    # 1) character mask: flood-fill the pure-black background from the border
    black = rgb.max(axis=2) < 9
    lab, _ = ndi.label(black)
    border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    fg = ndi.binary_fill_holes(~np.isin(lab, list(border)))
    # 2) skin components (face, arms) by colour
    hsv = cv2.cvtColor(rgb, cv2.COLOR_RGB2HSV)
    Hc, Sc, Vc = [hsv[..., i].astype(int) for i in range(3)]
    skin = ndi.binary_opening((Hc >= 5) & (Hc <= 20) & (Sc >= 40) & (Sc <= 140) & (Vc >= 170) & fg, iterations=1)
    l2, _ = ndi.label(skin)
    yy, xx = np.mgrid[0:Hh, 0:Ww]
    at = lambda x, y: l2 == l2[y, x]
    face, armL, armR = at(500, 250), at(140, 450), at(880, 450)
    dress = ((Hc >= 18) & (Hc <= 34) & (Sc >= 120) & (Vc >= 180)) | ((Hc >= 95) & (Hc <= 112) & (Sc >= 100))
    skin_col = np.median(rgb[face & (yy > 300) & (yy < 360) & (xx > 470) & (xx < 540)], axis=0).astype(np.uint8)

    def arm_layer(skin_mask, sign):
        m = ndi.binary_dilation(skin_mask, iterations=8) & fg & ~dress
        ys, xs = np.where(skin_mask); pts = np.stack([xs, ys], 1).astype(float); c = pts.mean(0)
        ax = np.linalg.svd(pts - c, full_matrices=False)[2][0]
        if ax[0] * sign < 0: ax = -ax                       # axis points from the hand to the elbow
        t = (pts - c) @ ax
        elbow = pts[t > t.max() - 30].mean(0); hand = pts[t < t.min() + 0.30 * (t.max() - t.min())].mean(0)
        perp = np.array([-ax[1], ax[0]]); pr = (pts[t > t.max() - 40] - elbow) @ perp; half = (pr.max() - pr.min()) / 2
        ext = np.zeros((Hh, Ww), np.uint8)
        p1 = tuple(int(v) for v in elbow + ax * 75)
        cv2.line(ext, tuple(int(v) for v in elbow), p1, 255, int(half * 2)); cv2.circle(ext, p1, int(half), 255, -1)
        return m, ext > 0, elbow, hand

    mL, extL, elL, haL = arm_layer(armL, 1)
    mR, extR, elR, haR = arm_layer(armR, -1)
    # 3) head and body masks
    faceD = ndi.binary_dilation(face, iterations=7) & fg & (yy < CHIN_Y)
    A = fg & (yy < HEAD_BOX['y_max']) & (xx >= HEAD_BOX['x_min']) & (xx <= HEAD_BOX['x_max'])
    head = A | faceD
    body = fg & ~mL & ~mR & ~(head & (yy < NECK_KEEP_Y))
    rgba = lambda mask, src=rgb: np.dstack([src, (mask * 255).astype(np.uint8)])
    armLimg, armRimg = rgb.copy(), rgb.copy()
    armLimg[extL & ~mL] = skin_col; armRimg[extR & ~mR] = skin_col
    # 4) eyelids, closed mouth, wide mouth (inpainted skin + hand-drawn details)
    ell = lambda c, rx, ry: cv2.ellipse(np.zeros((Hh, Ww), np.uint8), c, (rx, ry), 0, 0, 360, 255, -1) > 0
    lidmask = ell(EYES[0], 40, 36) | ell(EYES[1], 40, 36)
    lid = cv2.inpaint(rgb, (lidmask * 255).astype(np.uint8), 9, cv2.INPAINT_TELEA)
    for c in EYES:
        pts = np.array([[c[0] + dx, int(c[1] + 9 + 10 * np.sin(np.pi * (dx + 34) / 68))] for dx in range(-34, 35, 2)], np.int32)
        cv2.polylines(lid, [pts], False, (70, 40, 28), 5, cv2.LINE_AA)
    soft = lambda m, s: np.clip(cv2.GaussianBlur(m.astype(np.float32), (0, 0), s) * 1.3, 0, 1)
    L_lids = np.dstack([lid, (soft(lidmask, 3) * 255).astype(np.uint8)])
    mm = ell(MOUTH, 34, 26); base = cv2.inpaint(rgb, (mm * 255).astype(np.uint8), 9, cv2.INPAINT_TELEA)
    mc = base.copy()
    pts = np.array([[MOUTH[0] + dx, int(MOUTH[1] - 2 + 7 * np.cos(np.pi * dx / 56))] for dx in range(-24, 25, 2)], np.int32)
    cv2.polylines(mc, [pts], False, (150, 70, 70), 4, cv2.LINE_AA)
    mw = base.copy()
    cv2.ellipse(mw, (MOUTH[0], MOUTH[1] + 2), (24, 19), 0, 0, 360, (168, 48, 58), -1, cv2.LINE_AA)
    cv2.ellipse(mw, (MOUTH[0], MOUTH[1] + 10), (15, 8), 0, 0, 180, (240, 128, 130), -1, cv2.LINE_AA)
    cv2.ellipse(mw, (MOUTH[0], MOUTH[1] + 2), (24, 19), 0, 0, 360, (120, 50, 45), 3, cv2.LINE_AA)
    ma = (soft(mm, 2.5) * 255).astype(np.uint8)
    layers = {'body': rgba(body), 'head': rgba(head), 'arm-l': rgba(mL | extL, armLimg), 'arm-r': rgba(mR | extR, armRimg),
              'lids': L_lids, 'mouth-closed': np.dstack([mc, ma]), 'mouth-wide': np.dstack([mw, ma])}
    # 5) export (premultiplied resize avoids dark halos)
    os.makedirs(out, exist_ok=True)
    W2 = OUT_WIDTH; H2 = round(Hh * W2 / Ww)
    for name, a in layers.items():
        pm = a.astype(np.float32); al = pm[..., 3:4] / 255; pm[..., :3] *= al
        r = cv2.resize(pm, (W2, H2), interpolation=cv2.INTER_AREA); al2 = r[..., 3:4] / 255
        r[..., :3] = np.where(al2 > 0.002, r[..., :3] / np.maximum(al2, 1e-3), 0)
        Image.fromarray(np.clip(r, 0, 255).astype(np.uint8), 'RGBA').save(os.path.join(out, name + '.png'), optimize=True)
    pct = lambda p: [round(p[0] / Ww * 100, 2), round(p[1] / Hh * 100, 2)]
    meta = dict(canvas=[W2, H2], elbowL=pct(elL), elbowR=pct(elR), handL=pct(haL), handR=pct(haR), headPivot=pct(HEAD_PIVOT),
                mouth=pct(MOUTH), eyeL=pct(EYES[0]), eyeR=pct(EYES[1]), cheekL=pct(CHEEKS[0]), cheekR=pct(CHEEKS[1]), feet=pct(FEET),
                lidBand=[round(200 / Hh * 100, 2), round(285 / Hh * 100, 2)])
    json.dump(meta, open(os.path.join(out, 'rig.json'), 'w'), indent=1)
    print('wrote', len(layers), 'layers to', out); print(json.dumps(meta))


if __name__ == '__main__':
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('source'); ap.add_argument('--out', default='assets/rig')
    a = ap.parse_args(); build(a.source, a.out)
