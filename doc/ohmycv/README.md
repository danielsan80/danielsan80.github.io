# CV in ohmycv

Sorgente del CV finché la pagina `/cv` del sito non lo sostituisce. Si edita su
<https://ohmycv.app>: markdown più CSS custom, esportato in PDF.

## File

- `Danilo_Sanchi_v4.md`, `Danilo_Sanchi_v4_en.md` — markdown, italiano e inglese.
- `ohMyCV.css` — CSS custom, uguale per le due lingue: timeline e marker delle skill.
- `Danilo_Sanchi_v4.pdf`, `Danilo_Sanchi_v4_en.pdf` — export, riferimento visivo per la pagina del sito.
- `preview.html` — outerHTML di `#resume-preview` della versione inglese: la struttura che il markdown produce.
- `ohmycv-settings.png` — screenshot del pannello impostazioni.

## Impostazioni del pannello

Non stanno nel markdown né nel CSS: vivono nello stato dell'app.

| Impostazione        | Valore                          |
| ------------------- | ------------------------------- |
| Paper size          | A4                              |
| Theme color         | `#43912B`                       |
| Font family         | Minion Pro                      |
| Font size           | 15px                            |
| Margins top/bottom  | 50px (padding reso: 50px sopra, 40px sotto) |
| Margins left/right  | 45px                            |
| Paragraph spacing   | 29px, alzato per evitare timeline orfane a fondo pagina |
| Line spacing        | 1.3                             |

Il verde del tema è lo stesso di `.timeline-highlight` e `.timeline-dot` nel CSS custom.
