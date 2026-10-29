---
name: kanban
description: Kanban del progetto — feature, spike, esperimenti
user-invocable: true
---

# Kanban

Board di progetto: feature, spike tecniche, esperimenti. Vive nella
documentazione del progetto, non dentro questa skill:

- indice della board: `.private/kanban/README.md`
- card, una per file: `.private/kanban/cards/<slug>.md`
- archivio delle card chiuse: `.private/kanban/DONE.md`

Sta in `.private/`, il repo privato, perché il repo del sito è pubblico: le modifiche alla board si committano lì.

Se l'indice non esiste, crealo copiando `templates/board.md` (accanto a questo
file). In un progetto con una struttura diversa, cambia i tre percorsi qui sopra.

Regole d'uso:

- Per presentare la board o rispondere a "che abbiamo in programma?" basta l'indice: non leggere i file delle card.
- Leggi il file di una card solo quando ci si lavora o l'utente chiede dettagli su di essa.
- Nuova card: crea `cards/<slug>.md` (titolo `#` + corpo, nessuna struttura obbligata: ogni card ha le sezioni che le servono) e aggiungi la riga nella sezione giusta dell'indice.
- Decisioni, note e follow-up di lavorazione vanno nel file della card, non nell'indice.
- Le sezioni del BACKLOG, che sono anche quelle di DONE.md:
  - **Bug** — qualcosa si comporta male e va corretto.
  - **Refactoring** — cambiare la struttura senza cambiare il comportamento.
  - **Feature** — funzionalità nuova, di quelle che si vedono da fuori.
  - **Tech** — lavoro sul codice che non è né un bug né una funzionalità: test, build, tooling, infrastruttura, aggiornamenti di versione.
  - **Operations** — attività da svolgere a mano, **senza scrivere codice**. Se per chiuderla si apre l'editor sul codice, quasi sempre è Tech.
  - **Spike** — un'indagine a tempo, che produce una risposta e non del codice.
- EPIC raccoglie le card che raggruppano altre card: la card epica elenca le figlie, e ogni figlia la nomina in testa.
- Card completata: sposta la riga in DONE. Ogni tanto, **su richiesta dell'utente**, le card DONE vanno archiviate: sposta il corpo in `.private/kanban/DONE.md` sotto la sezione giusta, mantenendo lo stile delle voci esistenti, poi elimina file e riga. Non farlo di iniziativa.

Quando l'utente invoca `/kanban`, leggi l'indice, presenta la board e chiedi cosa vuole affrontare.
