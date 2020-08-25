---
layout: post
title:  "My DDD code tree"
categories: [DDD]
tags: [ddd, php]
home: false

---

Come organizzare il codice? Qual è la struttura più versatile? Ognuno sembra farlo in un modo diverso.
Symfony PHP Framework ha una sua proposta ma dopo averci lavorato un po' non sembra poi così versatile.

Allora possiamo provare a ricalcare le code tree di alcuni progetti molto noti ma è difficile individuare un pattern
che li accomuna.
 
Eppure nei progetti ben fatti una classe è esattamente dove ci aspettiamo che sia.
Noi vorremmo ottenere la stessa cosa con i nostri progetti.

In alcuni casi la struttura che scegliamo porta a non sapere dove collocare una nuova classe perché non abbiamo
previsto fin dall'inizio una code tree scalabile.

Abbiamo un grosso vincolo da rispettare che per certi versi è scomodo: la code tree è appunto un albero perché
il file system è organizzato ad albero e i file di un progetto seguono quest'organizzazione
a cartelle, sottocartelle e file.

> In PHP le classi sono organizzate in modo che la loro posizione fisica coincida con la loro posizione logica:
in altre parole namespace e posizione del file coincidono (non è esattamente così ma il concetto è questo).

Il problema è che non abbiamo un solo modo per posizionare i concetti del nostro progetto. Esistono più gerarchie
di concetti che dovremmo rappresentare. A volte non si tratta di alberi ma di grafi di concetti. Però noi abbiamo
a disposizione un solo albero per incastrare tutti i nostri concetti. O scegliamo una sola gerarchia oppure cerchiamo
di fonderle in una sola gerarchia. 

Vogliamo ovviamente organizzare i concetti dalla grana grossa alla più fine.

Ma vogliamo anche organizzare i concetti in Dominio, Applicativa, Api, Persistenza, ... e Infrasttutura.

Poi vogliamo mettere in relazione le classi di test con quelle testate.

Vogliamo mettere in relazione le classi concrete con le interfacce che implementano e su quale canale.

Come mettere in evidenza tutte queste relazioni tra i concetti in un unica gerarchia?

Possiamo duplicare parte dell'albero: il tree dei test replica il tree della sorgente sotto il namespace `\Tests`
in modo che ogni classe di test abbia lo stesso namespace della classe testata e lo stesso nome con il suffisso `Test`. 
In questo caso la relazione tra classe di test e classe testa è data dal fatto che condividono parte del path: è una
relazione debole.

### Struttura
La mia proposta per organizzare il codice è questa:

[`<vendor>`]\\`<project>`\\`<context>`\\[`<subcontext>`]\\*

Dove `<vendor>` sarebbe il nome dell'organizzazione, ad esempio "Acme", ed è opzionale se il nome del progetto
è sufficientemente univoco. 

Dove `<project>` sarebbe il nome del progetto, ad esempio "JobBoy" o "FixtureHandler" (il primo è sufficientemente
caratteristico da non richiedere il `<vendor>` mentre il secondo no) 

Dove `<context>` sarebbe il contesto, ad esempio "User" o "Security", destinato in caso a diventare il bounded context

Dove `<subcontext>` sarebbe un eventuale sottocontesto. In realtà diventerebbe il vero contesto insieme al `<context>`.

Ecco alcuni esempi:

- `JobBoy\\Process\*` qui non c'è bisogno di vendor
- `Dan\FixtureHandler\*` qui non c'è bisogno di separare il codice in contesti dato che è una piccola libreria.

A questo punto specifichiamo il layer: `Domain` e `Application`
ma anche `Api`|`Http`, `Console`, `Persistense`, `UI`, ...

`Domain` e `Application` sono indispensabili e codificati, gli altri sono a nostra discrezione.

`Infrastracture` non lo consideriamo un layer perché si comporta diversamente ma può opzionalmente trovarsi sullo
stesso livello dei layer.
 
La relazione è questa: 
```
Domani <- Application <- Api|Http
                      <- Console
                      <- Persistense
                      <- UI
                      ...
^         ^              ^
----------Infrastructure------------
```

Quindi nella gerarchia avremo 

... \\`<context>`\\[`<subcontext>`]\\`<layer>`
... \\`<context>`\\[`<subcontext>`]\\`Infrastructure` 
 
Dentro al `<layer>` il namespace continua così
... \\`<layer>`\\`<layer-context>`\\`<layer-subcontext>`\\ `Entity`|`Service`|`Repository`|`Model`

Qui è abbastanza discrezionale, dipende dalla quantità di classi che sono presenti dentro al layer e a
come si preferisce organizzarle. 

In qualsiasi punto del namespace è possibile appendere `Infastructure`\\`<channel>`

Questo significa che in vogliamo creare una versione infrastrutturale di un'interfaccia/classe presente in quel
namespace o in un sotto namespace. `<channel>` sarà una keyword che rappresenta per quale canale implementiamo
una classe concreta: esempio `Doctrine` per l'implementazione di repository Doctrine o `MongoDB` o `Symfony`...  

Da dentro `Infastructure`\\`<channel>` duplichiamo il tree fino a raggiungere la classe, come facciamo per i test:

esempio:
`JobBoy\Process\Domain\Process\Repository\ProcessRepository.php`
`JobBoy\Process\Domain\Process\Repository\Infrastructure\Doctrine\DoctrineProcessRepository.php`
oppure
`JobBoy\Process\Infrastructure\Doctrine\Domain\Process\Repository\DoctrineProcessRepository.php`
oppure
`JobBoy\Process\Domain\Infrastructure\Doctrine\Process\Repository\DoctrineProcessRepository.php`

L'idea è che da quando inseriamo `Infrastructure` non siamo più nel layer in cui eravamo ma siamo passati al
layer infrastrutturale relativo al layer lasciato.

Allo stesso modo possiamo appendere in qualsiasi punto del namespace `Test` che è diverso da `\Tests`
`Test` classi di supporto al testing e può trovarsi sia sotto la sorgente che sotto `\Tests` a seconda che si voglia
rendere disponibile le classi di supporto al test ai componenti/app che dipendono dal modulo che stiamo scrivendo.
Anche `Testing` potrebbe andare bene. 

Una semplice regola da tenere a mente è che il codice non Infrastrutturale non deve dipendere da niente di terze parti.
In Domain, Application, UI,... non estendiamo/implementiamo nulla di terze parti. Uncle Bob chiama queste classi POJO,
POPO in Php.

Ok, qualcosa lo possiamo anche utilizzare ma solo utility, in nessun caso possiamo dipendere da interfaccie non native
nel nostro codice. Questa regola è ferrea per il core e si rilassa man mano che ci allontaniamo dal Domain.

  
