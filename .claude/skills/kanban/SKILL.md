---
name: kanban
description: Kanban del progetto — feature, spike, esperimenti
user-invocable: true
---

# Kanban

> **[TEMPORANEO] Skill disabilitata.** La board di progetto è su Jira: sito
> `danilosanchi.atlassian.net`, progetto `danilosanchi.net`, key `SITE`
> (cloudId `b922ac38-2f7a-4785-bf54-caf2eb9045e4`). Usa i tool MCP `mcp__atlassian__*`,
> non questo file. Se l'utente invoca `/kanban`, leggi la board da Jira.
>
> Fase di prova dell'integrazione Jira via MCP. Se l'utente decide di tornare ai file,
> si migrano le issue Jira in `cards/` e si rimuove questa nota.

Board di progetto: feature, spike tecniche, esperimenti. Ogni card è una riga di questo indice + un file in `cards/`.

Regole d'uso:

- Per presentare la board o rispondere a "che abbiamo in programma?" basta questo indice: non leggere i file delle card.
- Leggi il file di una card solo quando ci si lavora o l'utente chiede dettagli su di essa.
- Nuova card: crea `cards/<slug>.md` (titolo `#` + corpo) e aggiungi la riga nella sezione giusta.
- Decisioni, note e follow-up di lavorazione vanno nel file della card, non nell'indice.
- Card completata: sposta la riga in DONE. Ogni tanto, **su richiesta dell'utente**, le card DONE vanno archiviate: sposta il corpo in [doc/DONE.md](../../../doc/DONE.md) sotto la sezione giusta (`## Bug`, `## Feature`, `## Refactoring`, `## Operativo`) mantenendo lo stile delle voci esistenti, poi elimina file e riga. Non farlo di iniziativa.

Quando l'utente invoca `/kanban`, presenta la board e chiedi cosa vuole affrontare.

## IDEAS

## BACKLOG

### Bug

### Refactoring

### Feature

### Operativo

### Spike

## DOING

## DONE