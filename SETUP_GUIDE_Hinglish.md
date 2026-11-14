# Setup guide (Hinglish): zip se live link tak

Ye guide bilkul beginner ke liye hai. Ek-ek step follow karo.

## Step 1: Zip kholo
1. `birthday-surprise-repo.zip` par right-click karo, **Extract All** karo.
2. Ek folder `birthday-surprise` milega. Uske andar `index.html`, `style.css`, `script.index.js` aur `assets` folder hona chahiye.
3. Kisi file ka naam ya jagah mat badalna.

## Step 2: Gaane lagao (optional)
1. WhatsApp ke gaane Android par yahan milte hain: `Android/media/com.whatsapp/WhatsApp/Media/WhatsApp Audio/`.
   (Ya WhatsApp Web par audio ke arrow par Download dabao.) Duration se pehchano: 1:05 = Happy Birthday, 0:39 = Channa Ve, 0:59 = Tainu Khabar Nahi, 0:30 = Je Tu Meri Jaan.
2. Gaane `assets/audio/` folder mein copy karo.
3. Sirf naam badlo, **extension waisa hi rehne do** (.mp3 ya .m4a). Windows mein View → "File name extensions" ON kar lo.

| Naam badlo | Kahan bajega |
|---|---|
| `ambient` | "ek surprise tumhare liye" screen aur cake banne tak |
| `channa-ve` | candles jalana aur wish |
| `je-tu-meri-jaan` | candles hatne se cake katne tak |
| `happy-birthday` | fireworks, balloons, photo gallery |
| `tainu-khabar-nahi` | aakhri lamba message |

Misaal: `ambient.mp3`, `channa-ve.mp3`. Gaane na ho to bhi page chalta hai (halki dhun bajti hai).
`.mp3` sabse safe hai. iPhone par `.opus` nahi chalta, uska mp3 bana lo.

## Step 3: Apne computer par chalao
1. VS Code install karo (free), phir **File → Open Folder** se `birthday-surprise` kholo.
2. Extensions mein **Live Server** install karo.
3. `index.html` par right-click karo → **Open with Live Server**. Browser mein page khul jaayega.

(Python hai to: folder mein terminal kholo aur `python -m http.server 8000` chalao, phir `http://localhost:8000` kholo.)

### Test karo
1. Naam likho aur **5 photos** chuno. Kisi photo par tap karke use **Queen** banao (beech wali, taaj ke saath). Jab tak naam + 5 photos nahi, button band rehta hai.
2. "Surprise shuru karo" dabao. Ambient bajta hai, cake banta hai.
3. **Candles Jalao** → match se saari candles jalti hain. **Make a Wish** → wo phoonk maarti hai.
4. **Cake Kaato** → slow-motion cut, phir fireworks aur balloons mein naam.
5. Photo gallery → "Ek chhota sa message" → wo "main ja rahi hu message padhne" bolke chali jaati hai → lamba message.

## Step 4: Apna message aur signature
`script.index.js` kholo, sabse upar `CONFIG` hai:
- `message`: apne paragraphs likho (`{name}` apne aap naam ban jaata hai).
- `from: 'Rahul'`: signature mein apna naam.
- `pace: 1.3`: aur araam se chahiye to `1.6`, tez chahiye to `1`.
Save karke browser refresh karo.

## Step 5: GitHub par daalo
1. github.com par account banao (free). **New repository** dabao, naam `birthday-surprise`, **Public** chuno.
2. **uploading an existing file** link dabao. Folder ke **andar ki saari files aur folders** (`assets`, `docs`, `tools`, `.github`, `index.html`, ...) drag karke daalo, phir **Commit changes**.
3. **Settings → Pages**: Source mein **GitHub Actions** chuno (ya "Deploy from a branch → main → / (root)").
4. 1-2 minute baad link banta hai: `https://<aapka-username>.github.io/birthday-surprise/`.
5. Personal link: `...github.io/birthday-surprise/?name=Aarohi&from=Rahul` (naam pehle se bhara aata hai).

**Link preview (WhatsApp par photo + title wala card):** link live hone ke baad ek baar ye chalao (Python chahiye):
`python tools/set_site_url.py https://<aapka-username>.github.io/birthday-surprise/`
Phir `index.html` GitHub par dobara upload kar do. Agar WhatsApp purana preview dikhaye to link ke end mein `?v=2` laga ke bhejo.

Dhyan rakho: photos kahin upload nahi hoti, jis device par page khulta hai wahin chunni padti hain.

## Upload se pehle checklist
- [ ] Gaane GitHub par mat daalo (copyright). Wo `.gitignore` se apne aap ruk jaate hain, par web upload mein khud dhyan rakho.
- [ ] `assets/bg` ki photos web se li hui hain. Public karne se pehle apni photos se badal do ya delete kar do (page phir bhi chalta hai).
- [ ] Character ki image par aapka haq hai, ye dekh lo.
- [ ] `README.md` mein `<your-user>` aur `<your-repo>` apne naam se badal do.

## Dikkat aaye to
| Dikkat | Hal |
|---|---|
| Page khaali ya design toota | Live Server se kholo, double-click se nahi. |
| Music nahi baj raha | File ke naam sahi hain? Upar-right ka mute button? Phone silent mode? |
| Button band hai | Naam aur poori 5 photos chahiye. |
| GitHub par 404 | 1-2 minute ruko, phir Settings → Pages check karo. |
| Kuch aur | F12 dabake Console mein jo laal error dikhe uska screenshot bhej do. |
