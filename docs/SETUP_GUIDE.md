# Setup guide

A step-by-step walkthrough: from the downloaded zip to a live link you can send to the birthday person.
No programming knowledge is required.

## 1. What you need

- A modern browser (Chrome, Edge, Firefox or Safari).
- A text editor. [Visual Studio Code](https://code.visualstudio.com/) is recommended (free).
- 5 photos of the birthday person and, optionally, up to 5 songs.
- A free [GitHub](https://github.com/) account (only for publishing).

## 2. Get the files

1. Unzip `birthday-surprise-repo.zip`. You get a folder named `birthday-surprise`.
2. Keep the folder structure exactly as it is. Do not rename or move `index.html`, `style.css`,
   `script.index.js` or the `assets` folder.

```
birthday-surprise/
├── index.html
├── style.css
├── script.index.js
└── assets/
    ├── audio/   ← put your songs here
    ├── bg/      ← background photos (replace with your own)
    └── rig/     ← the animated character (do not touch)
```

## 3. Add your songs (optional)

Copy your audio files into `assets/audio/` and rename **only the part before the extension**:

| Rename to | Plays during |
|---|---|
| `ambient` | title card and cake build-up |
| `channa-ve` | lighting the candles and the wish |
| `je-tu-meri-jaan` | from removing the candles to cutting the cake |
| `happy-birthday` | fireworks, balloons, gallery |
| `tainu-khabar-nahi` | the final message |

Examples: `ambient.mp3`, `happy-birthday.m4a`. Keep the real extension (`.mp3` is the safest choice;
Safari on iPhone does not play `.opus`). On Windows, enable **View → File name extensions** so you can see them.
Missing songs are replaced by a soft synthesised tune, so the page still works.

## 4. Run it on your computer

Pick one option.

**A. VS Code + Live Server (easiest)**
1. In VS Code choose **File → Open Folder** and select `birthday-surprise`.
2. Open the Extensions panel, install **Live Server**.
3. Right-click `index.html` → **Open with Live Server**. The page opens at `http://127.0.0.1:5500`.

**B. Python**
```bash
cd birthday-surprise
python3 -m http.server 8000      # on Windows: python -m http.server 8000
```
Open `http://localhost:8000`.

**C. Node**
```bash
cd birthday-surprise
npx serve .
```

### What you should see (test checklist)

1. A setup screen. Type the name and add **5 photos** (tap a photo to make it the Queen photo). The start button
   stays disabled until both are done.
2. "…a surprise for you" title card with the ambient song, then the cake builds up.
3. **Candles Jalao** → a match lights the letters. **Make a Wish** → she blows, the candles lift away.
4. **Cake Kaato** → slow-motion cut, then fireworks and balloons spelling the name.
5. The photo gallery with the crowned Queen frame → **message** button → the farewell → the long message.

## 5. Personalise

Open `script.index.js` and edit the `CONFIG` block at the top:

- `message` – your own paragraphs (`{name}` becomes the entered name).
- `from` – the name in the signature, e.g. `from: 'Rahul'`.
- `pace` – `1.3` is calm; use `1` for faster or `1.6` for slower.
- Button texts (`lightLabel`, `buttonLabel`, `cutLabel`) and the songs (`audio`).

Save the file and refresh the browser.

## 6. Publish on GitHub

### Option A – no tools (web upload)
1. Create a repository on GitHub (**New**, e.g. `birthday-surprise`, public or private*).
2. Click **uploading an existing file**, drag the **contents** of the folder (including the `assets`, `docs`,
   `tools` and `.github` folders) into the page and press **Commit changes**.
3. Open **Settings → Pages** and choose **Source: GitHub Actions** (the included workflow publishes the site).
   Alternatively choose **Deploy from a branch → main → / (root)**.
4. After a minute your site is live at `https://<your-username>.github.io/<repository>/`.

\* GitHub Pages on private repositories needs a paid plan; use a public repository on the free plan.

### Option B – Git
```bash
cd birthday-surprise
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/<repository>.git
git push -u origin main
```
Then enable Pages as in step 3 above.

### Rich link preview (Open Graph)
Run once you know your address (it must be an absolute `https://` URL):

```bash
python tools/set_site_url.py https://<your-username>.github.io/<repository>/
python tools/check_og.py        # optional: validates tags, image size and text length
```
Commit and push. If WhatsApp still shows an old preview, share the link with `?v=2` at the end, or paste the link in the
[Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) and press **Scrape Again**.

### Share a personal link
Add the name to the URL so the form is pre-filled:

`https://<your-username>.github.io/<repository>/?name=Aarohi&from=Rahul`

The photos must be chosen on the device that opens the page (they are never uploaded anywhere).

## 7. Before you publish – checklist

- [ ] Songs are in `assets/audio/` only on your computer (they are git-ignored). Do not upload copyrighted music publicly.
- [ ] You have the right to publish the photos in `assets/bg/`, or you replaced/deleted them.
- [ ] You have the right to publish the character artwork in `assets/rig/`.
- [ ] You changed the placeholders in `README.md` (`<your-user>`, `<your-repo>`) and, if you like, the name in `LICENSE`.

## 8. Troubleshooting

| Problem | Fix |
|---|---|
| Page is blank or styles are missing | Open it through a local server (step 4), not from a zip preview. |
| No music | Check the file names, the mute button (top right) and the phone's silent switch. |
| Start button is disabled | A name and exactly five images are required. |
| Pages shows 404 | Wait a minute, then check **Settings → Pages**. `index.html` must be in the repository root. |
| Workflow failed | Set **Settings → Pages → Source** to **GitHub Actions** and re-run the workflow. |
| Something else | Press F12, open the **Console**, and copy the red error text. |

## 9. Updating later

Edit a file on your computer, commit and push (or upload the changed file on GitHub). The workflow redeploys automatically.
