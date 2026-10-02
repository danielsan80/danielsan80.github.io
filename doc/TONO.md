# Tono di voce

Come si scrivono i testi in `src/content/`. Lo stile visivo è in
[STILE.md](STILE.md).

## Una voce, tre densità

Parla la stessa persona in tutti i canali: cambia quanto si dice e in che
forma, non chi parla. È il vincolo di STILE.md applicato alle parole: se
servissero due voci, l'impostazione del sito sarebbe sbagliata.

Vale ovunque:

- **Fatti, non aggettivi.** Una qualità si mostra con un dettaglio
  verificabile — il lettore NFC segato, i download del gantry, il worker che
  cron o supervisord riavviano — invece di dichiararla ("con cura",
  "elegante", "altamente affidabile").
- **Onestà sui limiti.** Progetti fermi, esiti parziali e alternative migliori
  si dicono: FixtureHandler rimanda a Foundry.
- **Il termine preciso**, anche tecnico, nella misura in cui il lettore del
  canale lo regge.
- **Le note sono la fonte.** Ogni testo si scrive a partire da `notes`, che
  tiene tutto; i canali scelgono.

## Sito — `channels.site`, `channels.home`

Registro da maker che presenta le sue cose, a chiunque.

- Prima persona; plurale quando il progetto è di più persone, dicendo chi.
- Un racconto breve: l'esigenza, l'idea o il trucco, cosa è diventato. Si
  parte dalla storia, non dalla scheda.
- Niente metadati da scheda (licenza, versioni, CI/CD): stanno nei link.
- Riferimenti che chiunque capisce: Hot Wheels, non coke can car.
- I clienti non si nominano.
- Un progetto sta fra i 300 e i 450 caratteri.

## CV — `channels.cv`

Registro professionale: denso, scorrevole in pochi secondi, stampabile.

- Esperienze: bullet in stile nominale ("Migrazione della suite di test…"), un
  fatto per bullet, con l'esito quando c'è.
- Progetti: una riga da scheda — cos'è, licenza, dove sta, stato.

## Profilo LinkedIn — `channels.linkedin`

Vale per i testi del profilo — esperienze e progetti — non per i post.

Registro del caso raccontato: prima persona al passato, paragrafi brevi.

- Contesto, cosa ho fatto, com'è andata: problema → intervento → esito
  (`SITE-18`).
- Può nominare i clienti, e dire cosa ho imparato.
- Il testo si incolla così com'è: niente markdown.

## Post LinkedIn — fuori da questo repo

I post non nascono da `src/content/` ma dai documenti di life-hacks, e lì si
scrivono: piano e decisioni nella campagna LinkedIn.

La differenza dal profilo: il profilo è una scheda che chi mi valuta consulta,
il post un episodio che arriva nel feed di chiunque. Per questo il registro è
quello del maker del sito, appena più professionale: una persona che racconta
cosa ha fatto, non un'azienda che si presenta. I clienti, che il profilo può
nominare, nei post restano anonimi salvo permesso.
