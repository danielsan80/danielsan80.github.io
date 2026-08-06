---
name: kanban
description: Kanban del progetto — feature, spike, esperimenti
user-invocable: true
---

# Kanban

> **[TEMPORANEO] Skill disabilitata.** La board di progetto è su Jira: sito
> `danilosanchi.atlassian.net`, progetto `danilosanchi.net`, key `SITE`
> (cloudId `b922ac38-2f7a-4785-bf54-caf2eb9045e4`). Usa i tool MCP `mcp__atlassian__*`,
> non i file qui sotto. Se l'utente invoca `/kanban`, leggi la board da Jira.
>
> Fase di prova dell'integrazione Jira via MCP. Se l'utente decide di tornare ai file,
> si migrano le issue Jira in `doc/kanban/cards/` e si rimuove questa nota.

Board di progetto: feature, spike tecniche, esperimenti. Vive nella
documentazione del progetto, non dentro questa skill:

- indice della board: `doc/kanban/README.md`
- card, una per file: `doc/kanban/cards/<slug>.md`
- archivio delle card chiuse: `doc/kanban/DONE.md`

Se l'indice non esiste, crealo copiando `templates/board.md` (accanto a questo
file). In un progetto con una struttura diversa, cambia i tre percorsi qui sopra.

Regole d'uso:

- Per presentare la board o rispondere a "che abbiamo in programma?" basta l'indice: non leggere i file delle card.
- Leggi il file di una card solo quando ci si lavora o l'utente chiede dettagli su di essa.
- Nuova card: crea `cards/<slug>.md` (titolo `#` + corpo, nessuna struttura obbligata: ogni card ha le sezioni che le servono) e aggiungi la riga nella sezione giusta dell'indice.
- Decisioni, note e follow-up di lavorazione vanno nel file della card, non nell'indice.
- Card completata: sposta la riga in DONE. Ogni tanto, **su richiesta dell'utente**, le card DONE vanno archiviate: sposta il corpo in `doc/kanban/DONE.md` sotto la sezione giusta (`## Bug`, `## Feature`, `## Refactoring`, `## Operativo`) mantenendo lo stile delle voci esistenti, poi elimina file e riga. Non farlo di iniziativa.

Quando l'utente invoca `/kanban`, leggi l'indice, presenta la board e chiedi cosa vuole affrontare.
