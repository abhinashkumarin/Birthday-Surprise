#!/usr/bin/env python3
"""
Point the Open Graph tags in index.html at your real website address.

  python tools/set_site_url.py https://YOUR-USERNAME.github.io/birthday-surprise/
  python tools/set_site_url.py https://mywebsite.com/ --version 2     # cache-busting: og.jpg?v=2

Updates <meta property="og:url"> and <meta property="og:image"> (absolute https URLs are required
by WhatsApp, Facebook and others). Safe to run again whenever the address changes.
"""
import argparse, re, sys
from pathlib import Path

p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
p.add_argument('url', help='public https address of the site, e.g. https://you.github.io/repo/')
p.add_argument('--version', help='append ?v=<version> to the image URL to bypass preview caches')
p.add_argument('--file', default='index.html')
a = p.parse_args()

if not a.url.startswith('https://'):
    sys.exit('Error: the URL must start with https:// (link previews require HTTPS).')
base = a.url if a.url.endswith('/') else a.url + '/'
image = base + 'og.jpg' + (f'?v={a.version}' if a.version else '')
f = Path(a.file); html = f.read_text(encoding='utf-8')
html, n1 = re.subn(r'(<meta property="og:url" content=")[^"]*(")', lambda m: m[1] + base + m[2], html)
html, n2 = re.subn(r'(<meta property="og:image" content=")[^"]*(")', lambda m: m[1] + image + m[2], html)
if not (n1 and n2):
    sys.exit('Error: og:url / og:image tags not found in ' + a.file)
f.write_text(html, encoding='utf-8')
print('og:url   ->', base); print('og:image ->', image)
