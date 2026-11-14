#!/usr/bin/env python3
"""
Check the link-preview setup against the guide:

  - the 5 essential tags (og:type, og:title, og:description, og:image, og:url) use property="og:..."
  - og:image / og:url are absolute https URLs (not relative, not placeholders)
  - title is short (~40 characters), description is under 100 characters
  - og.jpg is 1200 x 630 px and under 300 KB

Usage: python tools/check_og.py            (run from the project root; needs: pip install pillow)
"""
import re, sys
from html.parser import HTMLParser
from pathlib import Path

class P(HTMLParser):
    def __init__(self): super().__init__(); self.og = {}
    def handle_starttag(self, tag, attrs):
        d = dict(attrs)
        if tag == 'meta' and d.get('property', '').startswith('og:'): self.og[d['property']] = d.get('content', '')

p = P(); p.feed(Path('index.html').read_text(encoding='utf-8')); og = p.og
ok = True
def check(cond, msg, warn=False, fail_msg=None):
    global ok
    print(('PASS ' if cond else ('WARN ' if warn else 'FAIL ')) + (msg if cond or not fail_msg else fail_msg))
    if not cond and not warn: ok = False

for k in ('og:type', 'og:title', 'og:description', 'og:image', 'og:url'): check(k in og and og[k], f'{k} present')
check(og.get('og:type') == 'website', 'og:type is "website"')
check(len(og.get('og:title', '')) <= 40, f'title length {len(og.get("og:title", ""))} (<= 40)')
check(len(og.get('og:description', '')) < 100, f'description length {len(og.get("og:description", ""))} (< 100)')
for k in ('og:image', 'og:url'):
    check(og.get(k, '').startswith('https://'), f'{k} is an absolute https URL')
    check('YOUR-USERNAME' not in og.get(k, ''), f'{k}: placeholder replaced with your real address', warn=True,
          fail_msg=f'{k}: still contains YOUR-USERNAME -> run: python tools/set_site_url.py https://YOUR-USERNAME.github.io/REPO/')
check(og.get('og:image', '').split('?')[0].endswith('/og.jpg'), 'og:image points to og.jpg')
img = Path('og.jpg')
check(img.exists(), 'og.jpg exists in the project root')
if img.exists():
    from PIL import Image
    w, h = Image.open(img).size
    check((w, h) == (1200, 630), f'og.jpg is {w} x {h} (expected 1200 x 630)')
    check(img.stat().st_size < 300 * 1024, f'og.jpg is {img.stat().st_size // 1024} KB (< 300 KB)')
print('\nAll required checks passed.' if ok else '\nSome checks failed.'); sys.exit(0 if ok else 1)
