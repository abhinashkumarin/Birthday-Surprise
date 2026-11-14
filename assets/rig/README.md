# Character rig (`assets/rig/`)

The animated girl is a 2D "puppet" built from separate transparent PNG layers, all with the same canvas
(720 × 1095 px) so they stack perfectly:

| Layer | Purpose |
|---|---|
| `arm-l.png`, `arm-r.png` | forearm + hand; rotate around the elbow (drawn behind the body) |
| `body.png` | dress, legs, braids, bows |
| `head.png` | hair + face; nods and turns around the neck |
| `lids.png` | inpainted skin patches with a lash line, revealed by `clip-path` to blink |
| `mouth-closed.png`, `mouth-wide.png` | mouth states used for lip movement while she speaks |

Poses are CSS variables on `.avatar[data-pose]` (`idle`, `light`, `blow`, `cut`, `cheer`, `wave`, `walk`);
`script.index.js` (`Avatar`) switches poses, blinks randomly and moves the mouth while speech bubbles are shown.
The match, the wind and the knife start at invisible anchors (`.pt.hand`, `.pt.mouth`) that rotate with the body part.

## Using another character

```bash
pip install numpy opencv-python scipy pillow
python tools/make_rig.py path/to/character.png --out assets/rig
```

The source must be an RGB image of the character on a **pure black** background, arms away from the body.
Adjust the eye / mouth coordinates at the top of `tools/make_rig.py` and the pivot percentages in
`style.css` (`.rg-arm.l`, `.rg-arm.r`, `.rg-head`) using the values printed by the script.

> Make sure you hold the rights to the character artwork you publish.
