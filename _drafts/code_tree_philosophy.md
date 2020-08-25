---
layout: post
title:  "Code tree philosophy"
categories: [code]
tags: [code, php]
home: false

---

Avete mai studiato i B-tree? Io all'università al corso di Basi di Dati.

Qui c'è una [simulazione](https://www.cs.usfca.edu/~galles/visualization/BTree.html).

E' bello perché si autoribilancia ogni volta che avviene un inserimento o una rimozione.

E' uno spettacolo.

Credo che l'organizzazione del codice sia come il b-tree
se hai tre cartelle sorelle con una sola classe dentro forse è
il caso di togliere le cartelle e mettere le tre classi nel padre.

Allo stesso modo se in una cartella ti finiscono troppe classi non omogenee tra loro forse
è il caso di smistarle in sottocartelle.

Lo stesso principio vale per l'organizzazione delle foto, dei documenti su Drive o sul FS.

Solo che considererei questi come superalberi ossia alberi di alberi 
il che implica che il ribilanciamento dovrebbe avvenire al più fino alla radice del sottoalbero,
perché ogni sottoalbero ha una sua omogeneità interna che è indipendente da quella di un altro sottoalbero

Ovvio che se ho lo stesso tipo di elementi sia in un sottoalbero che in un altro tenderò a organizzarli allo stesso modo
ma oggi credo che sia un po' costoso mantenere l'omogeneità cross sottoalbero.

(sottoalbero = bouded context)
(cartelle = namespace)


---

Io ho il mio dominio con le mie entità poi creo una versione infrastrutturale per usarle in Doctrine.

Io monto il mio codice in un'applicazione Symfony che ha le sue regole.

Metto il mio codice nella directory lib e quello e mio e solo mio... il mio tessoro.

Poi configuro l'applicazione Symfony perché usi il mio codice configurando il composer.json affinché becchi i miei namespace da lib

Configuro i miei servizi nel container

Collego il database e configuro la connessione usando il mio codice
Nel mio codice posso fornire degli helper, delle classi, codice inerme da usare in Symfony,
posso anche fornire dei file di mapping ma poi devo configurare symfony perché li usi

QUINDI: per me Symfony non è qualcosa di infrastrutturale (cioé si lo è ma non per il mio codice)
Symfony è il contenitore e la colla per rendere attivo il mio codice inerme.

Acme => Domain => Infrastructure --- Configuration <= Symfony (ci si avvicina sia da una parte che dall'altra)

E se devo fare un Bundle? Situazione ideale, ho un mio repository con codice completamente agnostico ed inerme
(si vabbé, orientato ad essere montato in symfony ma indipendente dal framework),
poi creo un bundle per integrarlo in Symfony (altro repo) per ridurre al minimo lo sforzo integrativo,
ed infine ho un App Symfony che usa il bundle

In questo caso il mapping lo metto nel bundle dove ho modo di testarlo/provarlo
(ma potrei anche metterlo nell'infratructure del core inerme per essere usato dal bundle

Acme => Domain => Infrastructure --- AcmeBundle --- Configuration <= Symfony

