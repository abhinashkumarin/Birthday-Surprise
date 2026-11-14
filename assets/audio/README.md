# Songs (`assets/audio/`)

The experience plays **one song per scene** and crossfades between them. The audio files are
**not included** in this repository (copyright). Add your own files here; they are ignored by Git.

| File name (without extension) | Plays during | Behaviour |
|---|---|---|
| `ambient` | the title card ("a surprise for you") and the cake build-up | loops |
| `channa-ve` | lighting the candles and the wish | loops |
| `je-tu-meri-jaan` | from removing the candles until the cake is cut | loops |
| `happy-birthday` | fireworks, balloons and the photo gallery | plays once, then `channa-ve` fades back in |
| `tainu-khabar-nahi` | the final long message | loops |

* Any of `.mp3`, `.m4a`, `.opus`, `.ogg`, `.wav` works; keep the real extension and only rename the base name.
  `.mp3` is the safest choice (iOS/Safari does not play `.opus`).
* `ambient` may also be placed directly in `assets/`.
* To change which song belongs to which scene, edit `CONFIG.audio.tracks` in `script.index.js`
  (`file`, `title`, `vol`, `loop`, `then`).
* If a file is missing, a soft synthesised tune is played instead, so nothing breaks.
* Only use music you are allowed to use, and do not commit it to a public repository.
