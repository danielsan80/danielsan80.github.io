# Regole progetto

Regole sintetiche: scrivi il minimo necessario per essere compresi.

- Termina i file con newline.
- Commenti nel codice in inglese.
- Feedback onesto: evidenzia problemi e alternative migliori senza giri di parole.
- Test first: scrivi i test prima dell'implementazione.
- Note nel codice: quando l'utente dice "ho lasciato una nota", cerca `@note` nel codice. Se la risolvi, rimuovi il commento. Se obietti e non fai nulla, lascialo finché non si decide insieme.
- Asserzioni: evita assertion roulette. Asserisci sul valore intero, non sulle sue parti.
  - OK: test di creazione che verificano le proprietà dell'oggetto costruito
  - NO: `toHaveLength(n)` seguito da asserzioni sui singoli elementi → usa `toEqual([...])`
  - NO: asserzioni separate su parti di un risultato → mappa e asserisci sull'array intero
- Git: non committare né pushare di tua iniziativa, solo su mia richiesta esplicita. Quando dico "committa", scegli tu il messaggio e committa subito — non propormi di committare né chiedermi di revisionare prima (la diff la guardo da solo; se il messaggio non mi piace lo riscrivo io). Messaggi in inglese, con prefisso in stile conventional commit (`feat:`, `fix:`, `docs:`, `test:`, `build:`, `chore:`, `refactor:`… — la lista non è chiusa, scegli quello che descrive il commit). Niente trailer `Co-Authored-By`.
  - Niente azioni distruttive: `git reset` e `git commit --amend` sono bloccati dai permessi. Per riscrivere la storia costruisci il risultato su un branch parallelo, senza toccare quello originale. I comandi finali — quelli che spostano un branch o sovrascrivono lavoro esistente — li eseguo io dopo aver revisionato.
- Piccoli passi: implementa una cosa alla volta.
- Librerie esterne: diffuse, ben supportate, componibili, stilizzabili. No monoliti.
- Quando ti parlo in inglese e ti scrivo "eng?", dammi un breve feedback sulle frasi che ho scritto, non ancora revisionate da te, correggendo i miei errori.
- Nomi variabili: evita nomi da una sola lettera, anche in scope locali.
- "il file" senza specificare quale = CLAUDE.md

## Dominio

Sito personale: https://danilosanchi.net

### Stato attuale (da sostituire)

GitHub Pages + Jekyll 3.10, tema `orderedlist`. Fermo a novembre 2024. È un hub di link (pacchetti Packagist `dansan`, repo GitHub raggruppati, un post di blog del 2019 marcato deprecato), non un sito personale.

Incoerenze note: dominio `danilosanchi.net` ma site name `danielsan80` e author `me`; il `<title>` della home eredita quello della prima sezione.

### Obiettivo

Revisione del sito, con personal branding unico per il lavoro e per il mondo nerd/geek/opensource. **Non sono due brand da separare**: il filo conduttore è la stessa persona che costruisce cose con cura dal 2007, in ufficio e in garage. I progetti personali (JobBoy, FixtureHandler, Minirace) sono elemento differenziante anche verso chi assume, non rumore da nascondere.

Sorgente del CV attuale: `doc/ohmycv/`.

### Architettura dei contenuti

- `/` — presentazione **e** hub insieme: chi sei, progetti in evidenza, ruolo attuale, tutti i link. Non un indice di navigazione.
- `/cv` — timeline completa, ottimizzata per stampa/PDF, linkabile da sola.
- `/projects` — hub dei repo catalogati per topic.
- Contatti: non una pagina, ma footer della home + testata del CV.

Due unificazioni che evitano duplicazione:

- **Progetti del CV e hub repo sono la stessa collection**, a profondità diverse: un flag `featured` decide chi appare in home e nel CV.
- **Un'unica collection `profiles`** (GitHub, Packagist, Thingiverse, LinkedIn…) alimenta footer, hub e testata del CV.

### Identità e lingua

- Identità principale: **Danilo Sanchi** (nome reale). `danielsan80` resta come handle GitHub storico, ma il sito lo lega esplicitamente alla persona.
- Sito in **inglese**. La sola pagina CV disponibile **anche in italiano**. Contenuto doppio solo dove serve.

### Scelte tecniche

- **Vite + React**, output statico. Il pre-rendering è un requisito, non un optional: il CV deve essere HTML già renderizzato per crawler, indicizzazione e stampa in PDF. Va risolto esplicitamente.
- **Contenuti in file versionati** nel repo: yaml/json/md con frontmatter. Nessun CMS, si editano da qui.
- **Struttura aperta a nuovi tipi di contenuto** (blog, talk, note): aggiungerne uno deve costare un file di dati più un template, non un refactoring. Senza però costruire astrazioni per contenuti che non esistono ancora.
- **Hosting**: oggi GitHub Pages, da confermare.

### Timeline

I separatori-timeline del CV sono un **elemento identitario da mantenere**: sono ciò che distingue visivamente questo CV.

- Posizioni **calcolate dalle date** a build time. In ohmycv erano percentuali hardcoded (`left: 98.78%`): non vanno replicate.
- Le **sovrapposizioni temporali sono volute**, non errori: anni da freelance con collaborazioni in parallelo (Idrolab/Soisy si sovrappongono per cinque anni). Il modello dati non deve assumere sequenzialità e la timeline deve mostrarle, non appiattirle.
- Va gestito il ruolo in corso (`end` assente), la data singola (corso di due giorni) e il range aperto ("Dal 2009").

### Stile

Da definire: oggi è il tema `orderedlist` di GitHub Pages, un default non una scelta. Vincolo guida: **una sola identità visiva** deve reggere sia il registro professionale sia quello nerd/maker. Se servissero due stili, l'impostazione del sito sarebbe sbagliata.

## Progetti fratelli

Altri progetti dell'utente, da consultare per confronti su convenzioni e soluzioni già adottate. Non vanno modificati: si guardano e basta.

- `~/www/projects/toshl-man` — React + Vite + TS. Origine delle regole git e dei permessi di questo progetto.
- `~/www/projects/qriddle` — React + Vite + TS, SPA a schermata singola: le "pagine" sono passi di un wizard scelti da uno stato in context, senza router e senza URL propri.
- `~/www/jobs/resolvi/coffeebreak` — progetto di lavoro. Origine della regola sui messaggi di commit (prefissi, niente trailer `Co-Authored-By`).

## Kanban

Board di progetto su Jira: sito `danilosanchi.atlassian.net`, progetto `danilosanchi.net`, key `SITE`, cloudId `b922ac38-2f7a-4785-bf54-caf2eb9045e4`. Usa i tool MCP `mcp__atlassian__*`.

La skill `/kanban` (board a file in `.claude/skills/kanban/`) è temporaneamente disabilitata: si sta provando Jira. Se la prova non convince, si migra tutto sui file.

Attriti noti dell'integrazione MCP, da valutare nella prova:

- **Il rank non è esposto**: si possono creare, leggere, modificare e transizionare le issue, ma non ordinarle nel backlog. L'ordine va trascinato in UI. La sequenza consigliata è annotata come commento su `SITE-1`.

Criterio di ripartizione: qui stanno le decisioni durevoli che servono all'inizio di ogni sessione; su Jira il lavoro da fare e il ragionamento legato al singolo item.