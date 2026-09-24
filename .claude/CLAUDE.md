# Regole progetto

Regole sintetiche: scrivi il minimo necessario per essere compresi.

- Termina i file con newline.
- Commenti nel codice in inglese, e **il meno possibile**. Il codice è la documentazione: se non si capisce cosa fa o perché, si cambia il codice, non si aggiunge una riga sopra. Un commento che dice l'ovvio costa tempo a leggerlo e a toglierlo, e fa rumore che nasconde i pochi che contano. A parità di dubbio, **uno in meno**: se non capisco chiedo.
  - Restano i **fatti sul mondo fuori dal file**, quelli che non si ricavano rileggendo meglio: cosa `Date.UTC` fa degli anni 0-99, cosa `resolveJsonModule` controlla e cosa no, come Vite deriva i nomi delle classi dei CSS module.
  - Il razionale di una scelta va nella card Jira, non nel codice.
  - Quelli per il revisore vanno marcati `@rev`: servono a capirsi durante la review, non restano nel codice. Quando lo chiedo, o prima di committare se te lo dico, togli tutti i `@rev`.
  - Tanti commenti sono un sintomo: se un pezzo ne attira, è il design da rivedere.
  - Vale anche sui commenti **già committati, anche non tuoi**: quando passi su codice che ne ha di superflui, segnalali e proponi di toglierli.
- Feedback onesto: evidenzia problemi e alternative migliori senza giri di parole.
- Test first: scrivi i test prima dell'implementazione.
- Asserzioni: evita assertion roulette. Asserisci sul valore intero, non sulle sue parti.
  - OK: test di creazione che verificano le proprietà dell'oggetto costruito
  - NO: `toHaveLength(n)` seguito da asserzioni sui singoli elementi → usa `toEqual([...])`
  - NO: asserzioni separate su parti di un risultato → mappa e asserisci sull'array intero
- Git: non committare né pushare di tua iniziativa, solo su mia richiesta esplicita. Quando dico "committa", scegli tu il messaggio e committa subito — non propormi di committare né chiedermi di revisionare prima (la diff la guardo da solo; se il messaggio non mi piace lo riscrivo io). Messaggi in inglese, con prefisso in stile conventional commit (`feat:`, `fix:`, `docs:`, `test:`, `build:`, `chore:`, `refactor:`… — la lista non è chiusa, scegli quello che descrive il commit). Niente trailer `Co-Authored-By`.
  - Niente azioni distruttive: `git reset` e `git commit --amend` sono bloccati dai permessi. Per riscrivere la storia costruisci il risultato su un branch parallelo, senza toccare quello originale. I comandi finali — quelli che spostano un branch o sovrascrivono lavoro esistente — li eseguo io dopo aver revisionato.
- Piccoli passi: implementa una cosa alla volta.
- Librerie esterne: diffuse, ben supportate, componibili, stilizzabili. No monoliti.
- Nomi variabili: evita nomi da una sola lettera, anche in scope locali.
- "il file" senza specificare quale = CLAUDE.md

## Dominio

Sito personale: https://danilosanchi.net

### Stato attuale (da sostituire)

GitHub Pages + Jekyll 3.10, tema `orderedlist`. Fermo a novembre 2024. È un hub di link (pacchetti Packagist `dansan`, repo GitHub raggruppati, un post di blog del 2019 marcato deprecato), non un sito personale.

Incoerenze note: dominio `danilosanchi.net` ma site name `danielsan80` e author `me`; il `<title>` della home eredita quello della prima sezione.

### Obiettivo

Revisione del sito, con personal branding unico per il lavoro e per il mondo nerd/geek/opensource. **Non sono due brand da separare**: il filo conduttore è la stessa persona, un esploratore e un costruttore, in ufficio e in garage. I progetti personali (Mini Race Challenge, QRiddle, JobBoy, FixtureHandler) sono elemento differenziante anche verso chi assume, non rumore da nascondere.

**La home parla della persona e dei suoi progetti**, non del lavoro: il lavoro è una parte della vita, con un rimando, non il tema della pagina.

Sorgente del CV: `src/content/`. Il CV fatto prima con ohMyCV sta fuori dal repo, in `~/Documenti/Projects/Lavoro/CV/ohMyCv/`: non si aggiorna più.

### Architettura dei contenuti

- `/` — la persona: ritratto, nome, headline, summary, i progetti in evidenza, "Dove trovarmi" (profili ed email). Non linka il CV.
- `/projects` — tutti i progetti, poi i repo GitHub per topic: link alle ricerche GitHub, non elenchi di repo. I topic sono curati in `topics.yaml`; "senza topic" chiude l'elenco e copre i repo non classificati.
- `/cv` — timeline completa, ottimizzata per stampa/PDF. **Non elencata**: nessun link dal sito e `noindex`, il link lo passa l'utente. Un link a scadenza è un'idea da esplorare più avanti.
- Pagina lavoro — prevista, non fatta: cosa posso fare per chi legge, raccontato con i casi, richiesta del CV, contatti.

Unificazioni che evitano duplicazione:

- **Una sola collection `projects`** (`projects.yaml`): tutti i progetti vanno in `/projects` e nel CV; `highlight`, con la foto, sceglie quelli della home. L'ordine è la **posizione nel file**, per importanza, in tutte le liste.
- **Un'unica collection `profiles`** (GitHub, Packagist, LinkedIn, Thingiverse) alimenta la home, la testata del CV e la ricerca dei topic.
- **I testi scritti per un posto stanno in `channels`**: `identity` ha `home` e `cv`, ognuno con `headline` e `summary`; progetti ed esperienze hanno `cv` e `linkedin`.

### Identità e lingua

- Identità principale: **Danilo Sanchi** (nome reale). `danielsan80` resta come handle GitHub storico, ma il sito lo lega esplicitamente alla persona.
- Sito **bilingue, italiano di default**: le pagine sono pre-renderizzate in italiano, l'inglese si sceglie dal selettore (IT prima di EN). La headline della home è solo in inglese, pensata così.

### Scelte tecniche

- **Vite + React**, output statico. Il pre-rendering è un requisito, non un optional: il CV deve essere HTML già renderizzato per crawler, indicizzazione e stampa in PDF. Va risolto esplicitamente.
- **Pagine HTML separate, niente router** (`SITE-5`). Ogni pagina è un entry di Vite con la sua app React: `index.html`, `projects.html` e `cv.html` sono **file piatti nella radice**, così gli URL non hanno lo slash finale (`/projects`, non `/projects/`). Gli URL esistono davvero — linkabili, stampabili, pre-renderizzabili con uno script `renderToString` invece che con un framework. Lo stato che deve sopravvivere alla navigazione (tema, lingua) sta in `localStorage`, non in memoria. Il tema ha Auto (segue il sistema, il default), Light e Dark; uno script inline nel `<head>` di ogni pagina applica quello salvato prima del primo paint. Le due direzioni non costano uguale: da qui si può passare a un router, il contrario è un rifacimento.
- **Contenuti in file versionati** nel repo: yaml/json/md con frontmatter. Nessun CMS, si editano da qui.
- **Struttura aperta a nuovi tipi di contenuto** (blog, talk, note): aggiungerne uno deve costare un file di dati più un template, non un refactoring. Senza però costruire astrazioni per contenuti che non esistono ancora.
- **Hosting**: oggi GitHub Pages, da confermare.

### Timeline

I separatori-timeline del CV sono un **elemento identitario da mantenere**: sono ciò che distingue visivamente questo CV.

- Posizioni **calcolate dalle date** a build time. In ohmycv erano percentuali hardcoded (`left: 98.78%`): non vanno replicate.
- Le **sovrapposizioni temporali sono volute**, non errori: anni da freelance con collaborazioni in parallelo (Idrolab/Soisy si sovrappongono per cinque anni). Il modello dati non deve assumere sequenzialità e la timeline deve mostrarle, non appiattirle.
- Va gestito il ruolo in corso (`end` assente), la data singola (corso di due giorni) e il range aperto ("Dal 2009").

### Stile

Decisioni in `doc/STILE.md`. Vincolo guida: **una sola identità visiva** deve reggere sia il registro professionale sia quello nerd/maker. Se servissero due stili, l'impostazione del sito sarebbe sbagliata.

## Kanban

Board di progetto su Jira: sito `danilosanchi.atlassian.net`, progetto `danilosanchi.net`, key `SITE`, cloudId `b922ac38-2f7a-4785-bf54-caf2eb9045e4`. Usa i tool MCP `mcp__atlassian__*`.

La skill `/kanban` (regole in `.claude/skills/kanban/`, board a file in `doc/kanban/`) è temporaneamente disabilitata: si sta provando Jira. Se la prova non convince, si migra tutto sui file.

Attriti noti dell'integrazione MCP, da valutare nella prova:

- **Il rank non è esposto**: si possono creare, leggere, modificare e transizionare le issue, ma non ordinarle nel backlog. L'ordine va trascinato in UI. La sequenza consigliata è annotata come commento su `SITE-1`.

Criterio di ripartizione: qui stanno le decisioni durevoli che servono all'inizio di ogni sessione; su Jira il lavoro da fare e il ragionamento legato al singolo item.
