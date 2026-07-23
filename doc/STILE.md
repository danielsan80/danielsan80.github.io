# Stile e identità visiva

Decisioni sul linguaggio visivo del sito. Card di riferimento: `SITE-16`.
Il ragionamento esteso che ha portato qui è in
[conversazioni/2026-07-22-stile.md](conversazioni/2026-07-22-stile.md).

## Direzione

**Una misura disegnata sulla pagina.** Segni piccoli, precisi, quantitativi:
strumentazione, non decorazione. È già il principio dietro la timeline e le barre
skill del CV attuale.

Regge entrambi i registri senza compromessi: sobria e stampabile per il lato
professionale, linguaggio della carta millimetrata e del banco di lavoro per il lato
maker. L'anima nerd entra dai **contenuti** (stampe 3D, repo, diagrammi), non da un
secondo stile.

Densità alta, non diluita: il CV denso è un segnale di sostanza. Un dettaglio fatto
benissimo — la timeline — vale più di dieci effetti.

## Decisioni prese

**Accento verde.** Confermato come colore personale, ma non il `#43912b` di ohmycv
(troppo vicino al contribution graph di GitHub). Nuova famiglia in OKLCH, tinta 150.

**Dark mode: sì.** Prevista dal primo giorno, non retrofittata. I colori nascono come
token semantici; in stampa si forza sempre il tema chiaro.

**Timeline: nessuna estensione, per ora.** Resta separatore tra le esperienze del CV.
Non va forzata su elementi per cui non è stata concepita: rappresenta *durate
sovrapposte*, e su una card progetto quel significato non c'è. Decisione rimandata.

**Tipografia: Public Sans + Commit Mono.** Scelta dal vivo sulla styleguide. Public Sans
(neutro, molto leggibile, nasce per la PA USA) per il testo; Commit Mono (stretto,
recente) per i metadati misurabili — date, durate, repo, linguaggi, versioni.
Self-hostati via `@fontsource`, non Google Fonts.

## Vincolo scoperto: servono due verdi

Il verde acceso `#0fbd59` ha **2.48:1 su bianco** — sotto il 4.5:1 richiesto per il
testo e sotto il 3:1 richiesto anche solo per un segno grafico. Sullo scuro invece fa
6.98:1.

Non è un difetto della scelta, è la fisica del verde brillante: **due verdi sono
necessari, non un vezzo**. Uno cupo per il tema chiaro, uno acceso per lo scuro. Lo
stesso ruolo semantico cambia colore col tema.

## Scala

Generata in OKLCH, tinta 150 (verde erba, appena verso lo smeraldo). Tutti i valori
sono dentro il gamut sRGB. Contrasti misurati contro `#ffffff` e `#191b19`.

### Verdi

| token | hex | oklch | su bianco | su scuro |
|---|---|---|---|---|
| `green-50` | `#e8fbeb` | `97% 0.03 150` | 1.08 | 16.01 |
| `green-100` | `#d0f7d6` | `94% 0.06 150` | 1.17 | 14.80 |
| `green-200` | `#a2ecb1` | `88% 0.11 150` | 1.38 | 12.52 |
| `green-300` | `#75df8f` | `82% 0.15 150` | 1.65 | 10.46 |
| `green-400` | `#44d070` | `76% 0.18 150` | 2.00 | **8.62** |
| `green-500` | `#0fbd59` | `70% 0.19 150` | 2.48 | **6.98** |
| `green-600` | `#03a14a` | `62% 0.17 150` | **3.39** | 5.10 |
| `green-700` | `#03823a` | `53% 0.145 150` | **4.94** | 3.50 |
| `green-800` | `#03642b` | `44% 0.12 150` | 7.35 | 2.35 |
| `green-900` | `#05441d` | `34% 0.09 150` | 11.32 | 1.53 |

`green-500` è il verde della famiglia, quello che identifica il colore.

### Verde spento (sage)

| token | hex | oklch | su bianco | su scuro |
|---|---|---|---|---|
| `sage-400` | `#8fad98` | `72% 0.045 155` | 2.43 | 7.11 |
| `sage-600` | `#5f7967` | `55% 0.04 155` | 4.76 | 3.63 |

Per i segni secondari: righelli, tick minori, bordi che devono esserci senza urlare.

### Neutri

| token | hex | oklch | su bianco | su scuro |
|---|---|---|---|---|
| `neutral-0` | `#ffffff` | `100% 0 0` | 1.00 | 17.28 |
| `neutral-50` | `#f6faf6` | `98% 0.006 150` | 1.06 | 16.35 |
| `neutral-100` | `#edf1ee` | `95.5% 0.006 150` | 1.14 | 15.19 |
| `neutral-200` | `#dde1dd` | `90.5% 0.006 150` | 1.32 | 13.05 |
| `neutral-300` | `#c8ccc8` | `84% 0.006 150` | 1.63 | 10.60 |
| `neutral-400` | `#a2a6a3` | `72% 0.006 150` | 2.47 | 6.99 |
| `neutral-500` | `#848784` | `62% 0.006 150` | 3.63 | 4.76 |
| `neutral-600` | `#676a67` | `52% 0.006 150` | 5.49 | 3.15 |
| `neutral-700` | `#4b4e4b` | `42% 0.006 150` | 8.44 | 2.05 |
| `neutral-800` | `#2e312f` | `31% 0.006 150` | 13.13 | 1.32 |
| `neutral-900` | `#191b19` | `22% 0.006 150` | 17.28 | 1.00 |
| `neutral-950` | `#0b0e0c` | `16% 0.006 150` | 19.39 | 1.12 |

Non sono grigi puri: portano una traccia di verde (chroma 0.006, stessa tinta). Non
si nota su un bordo, si nota su una pagina intera — i grigi appartengono alla
famiglia invece di sembrare presi altrove.

## Token semantici

Sono i soli che i componenti possono usare. La scala grezza sta in un posto solo e
non si tocca direttamente: è così che la dark mode costa poco.

| ruolo | chiaro | scuro |
|---|---|---|
| superficie | `neutral-0` | `neutral-900` |
| superficie alt | `neutral-50` | `neutral-950` |
| bordo | `neutral-200` | `neutral-800` |
| testo | `neutral-900` | `neutral-100` |
| testo attenuato | `neutral-600` | `neutral-400` |
| accento testo / link | `green-700` | `green-400` |
| accento segno (timeline, barre) | `green-600` | `green-500` |
| accento quieto | `sage-600` | `sage-400` |

La superficie scura è `#191b19`, **non nero pieno**: meno affaticante, e lascia sotto
spazio per una superficie più profonda.

## Conseguenze

**Barre skill.** Con un accento solo, la scala `verde / lime / arancione` sparisce da
sé: stessa tinta, tre lunghezze reali (100% / 65% / 35%). Il livello lo porta la
misura, non la temperatura del colore — nessuna competenza sembra più un warning.
Da valutare se un livello "low" vada mostrato affatto.

**Stampa.** Forza sempre i token del tema chiaro.

## La palette è dato derivato

`tools/palette.mjs` (`npm run palette`) genera la scala dalle definizioni OKLCH e fa
l'**audit dei contrasti**: esce con errore se una coppia semantica testo/superficie
scende sotto soglia, in uno qualsiasi dei due temi, o se un colore finisce fuori dal
gamut sRGB. Nessuna dipendenza.

Vale lo stesso principio delle posizioni della timeline: calcolato, non hardcodato.
Cambiare tinta o aggiungere un livello costa un numero e una rigenerazione, non 24
esadecimali riscritti a mano. Da agganciare alla CI quando esiste (`SITE-4`), così
l'accessibilità non si rompe di nascosto.

## Aperto

- **Scala di spaziature** e griglia di base.
- Se e quando estendere la timeline oltre il CV.