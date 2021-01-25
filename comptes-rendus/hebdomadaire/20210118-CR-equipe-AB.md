# Compte rendu hebdomadaire (semaine du 18 janvier)
## Résumé
### Séance du 19 janvier 2021 (4h)
- Nous avons choisi le jeu de carte Virus (jeu de cartes)
    - Pas trop "mainstream" -> plus original et plus de facilité à ajouter nos propres règles
    - D'une complexité suffisante pour le travail qui nous est demandé
- Discussion sur certains points techniques :
    - Utilisation probable du C++ :
        - Plébiscité par l'industrie (performance & robustesse)
        - Préférable à Java (plus controversé et moins motivant pour notre équipe)
        - Utile dans d'autres UEs
    - Volonté de mettre en place de la CI/CD sur notre projet
- Rédaction d'un document Google Docs contenant une estimation préliminaire du temps nécessaire à la réalisation de nos tâches (marge de 20 à 100%, selon les tâches)

### Réunion du 23 janvier 2021 (1h30)
- Choix d'un nom pour notre groupe : "Les Cavaliers de Troie" 🐴
- Décisions et explications concernant les méthodes de travail :
    - Utilisation de [GitHub Flow](https://guides.github.com/introduction/flow/) car simple mais efficace et adopté par de nombreuses entreprises et organisations
    - Git/GitLab
        - Confirmation que la plupart des membres du groupe sont à l'aise avec Git
        - Recommandations concernant issues, merge requests et branches de travail
- Décisions et explications concernant les technologies à utiliser
    - Validation de l'utilisation du C++ pour notre backend
        - Build system : Utilisation de CMake plutôt que Make (outil avec un plus haut niveau d'abstraction offrant une meilleure intégration avec un certain nombre d'IDEs, utilisé dans de nombreux projets et avec lequel certains membres ont un peu d'expérience)
    - Utilisation de TypeScript + Electron pour le frontend (simplifie le multiplateforme et permet la réutilisation du code pour le jeu en application web)
    - Partage de divers liens pour l'apprentissage des technologies que nous utiliserons
    - De nombreux membres ont exprimé leur enthousiasme par rapport au fait d'apprendre des technologies qui seront utiles plus tard dans nos études ou dans le monde professionnel
- Réflection sur le cahier des charges ("faut il y préciser le thème que nous adopterons dans notre jeu ?") -> questions à nos professeurs lors de la séance du 26 janvier
- Timesheet :
    - Commencer à rapidement à la remplir
    - Quel outil utiliser ?

### Discussion du 25 janvier 2021
Clockify.me nous semble être un bon outil pour le remplissage de nos timesheets, plusieurs membres ont déjà commencé à l'utiliser. Il fournit des fonctionnalités satisfaisantes en termes de collaboration et d'export des données générées.

### Tout au long de la semaine
- Documentation/apprentissage au sujet des technologies que nous utiliserons
- Mise en place de notre projet sur GitLab :
    - Configuration pour correctement traiter les contributions (branches protégées, CI...)
    - Premières contributions
- Création d'un logo pour notre groupe
- Première utilisation de l'outil Doodle pour voter pour un créneau de réunion
        
        
## La semaine prochaine (semaine du 25/01/2021)
- Adoption généralisée de Clockify.me (présentation lors de la séance du 26 janvier)
- Répartition des tâches (ou des thèmes comme DevOps, design, frontend, backend...)
- Cahier des charges / estimation de temps
- Finalisation de la mise en place de la pipeline CI
- Mise en place de CMake
- Améliorations générales sur le projet GitLab
- Autoformation aux outils à utiliser
- Probablement une nouvelle réunion de travail


## Difficultés rencontrées
- Techniques :
    - Configuration de Clockify.me légèrement plus difficile que prévue
- Humaines :
    - Il faut du temps pour que certains processus d'organisation deviennent des habitudes, au début il faut tout apprendre ce qui ralentit notre vitesse de travail


# Comptes rendus complets :
# Compte rendu de la séance du 19/01/2021

## Choix du jeu
Nous avons réfléchi à plusieurs jeux, notamment :
- Poker
- Loup Garou
- Munchkins
- Virus
- Quadrochess
- Parchis

Nous ne souhaitions pas travailler sur un jeu qui serait trop "mainstream", ni sur un jeu qui serait trop simple à implémenter.

Nous avons discuté en détail sur le jeu de cartes *Virus*. Après en avoir lu les règles il nous est apparu qu'il pouvait être une bonne base pour notre projet.
Les règles ne sont ni trop simples ni trop complexes et il est aisé d'ajouter nos propres règles et mécaniques de jeu (probablement plus que pour des jeux très connus comme le Poker).

Nous avons validé le choix de *Virus*, et nos professeurs nous ont confirmé qu'il était d'une complexité suffisante pour que nous puissions travailler dessus dans le cadre du projet intégrateur.

## Langage de programmation et technologies utilisées
### Langage
Il nous a semblé logique de s'orienter vers un langage orienté objet, plus adapté à la création d'applications modernes.

Nous nous sommes donc orientés vers le C++ : c'est un langage plébiscité par l'industrie, reconnu pour sa performance et sa robustesse.
Le langage Java est plus controversé et malgré sa popularité historique il nous a semblé que le choisir n'aurait pas été aussi motivant pour notre équipe.
Par ailleurs le C++ est également le langage que nous utiliserons dans le cadre de l'UE Interfaces Homme Machine, cela permet de bénéficier de l'expérience acquise dans ce langage pour deux enseignements à la fois.

Nous espérons limiter le nombre de langages utilisés au strict minimum requis pour nos besoins. Des discussions ultérieures nous laissent penser qu'il est possible que nous utilisions également TypeScript ou JavaScript pour le création de notre frontend (application multi-plateforme avec Electron, code réutilisable pour une application web). Ce choix reste à confirmer par l'ensemble des membres de notre équipe.

### Autres choix techniques
Nous mettrons probablement en place une pipeline CI/CD pour notre projet.

## Estimation du temps nécessaire pour la réalisaiton des tâches
À l'aide d'[un document Google Docs](https://docs.google.com/document/d/11CVzAiL37Lr6Z9LGv_a8PyWDmQYz_aYMWD5xS-3tZr8/edit?usp=sharing) nous avons estimé le temps nécessaire a la réalisation des tâches de notre projet, nous considérons que la marge d'erreur est comprise entre 20 et 100%, selon les tâches.


# Compte rendu de la réunion du 23/01/2021

## Nom du groupe
Nous avons eu plusieurs idées pour le nom de notre groupe :
- Geek Power
- Les Cavaliers de Troie
- Xterm-inator

Nous avons voté pour notre nom préféré et c'est ainsi que nous avons choisi "Les Cavaliers de Troie" 🐴.

## Méthode de travail
### GitHub flow
[GitHub flow](https://guides.github.com/introduction/flow/) est un flux de travaux recommandé par GitHub [et GitLab](https://docs.gitlab.com/ee/topics/gitlab_flow.html#github-flow-as-a-simpler-alternative) qui le décrit comme une alternative intéressante au Git flow de part son approche "simple et propre".

Le fait que GitHub flow soit ainsi recommandé et que de nombreuses entreprises l'aient adopté nous donne confiance en son efficacité. Il nous a semblé offrir un bon compromis entre simplicité d'utilisation et exigence de qualité.

### GitLab
Nous utiliserons bien sûr GitLab pour héberger notre projet Git, une majorité des membres de notre équipe ont indiqué se sentir à l'aise avec une utilisation basique de git.

Nous avons insité sur l'importance, lors du travail sur une branche, de récupérer fréquemment les derniers changements effectués sur la branche `main` afin de résoudre au plus vite les [conflits git](https://www.atlassian.com/fr/git/tutorials/using-branches/merge-conflicts).

#### Issues
Nous avons discuté de l'importance de l'utilisation des *issues* GitLab pour garder une trace et discuter des tâches à accomplir, qu'il s'agisse de l'implémentation des fonctionnalités, de correction de bugs, ou plus généralement de tout élément nécessitant une discussion ou action de notre équipe.

Nous avons mentionné plusieurs fonctionnalités des issues qu'il sera important d'utiliser :
- Les *labels* afin de classer les issues selon leur type (par exemple : bug, nouvelle fonction, documentation...)
- L'assignation d'une issue à une ou plusieurs personnes (permet de s'assurer que quelqu'un s'occupe bien de la tâche donnée et d'éviter que plusieurs personnes fassent un travail redondant)
- L'attribution d'une date limite à une issue (cela fonctionnera sans doute de pair avec la méthode de développement que nous choisirons et nous aide à atteindre nos objectifs dans le temps imparti)
- L'ajout des issues à des milestones, ce qui permettra de suivre le pourcentage de progrès effectué sur diverses "tâches majeures" (par exemple : "Interface utilisateur", "Logique de jeu", "Redesign"...)

#### Merge requests
Les *merge requests* (équivalent GitLab aux pull request de GitHub) seront l'unique façon de contribuer du code à la branche principale `main`.
Au niveau de l'interface de GitLab, une merge request ressemble beaucoup à une issue à la différence près qu'elle contient le code représentant les changements qui ont été effectués dans la branche de travail correspondante (cf. GitHub flow).
Il sera fortement recommandé, dès lors que les changements ne sont pas triviaux, qu'au moins un autre membre de l'équipe puisse relire ceux-ci afin de trouver de potentielles erreurs ou des points améliorables (par exemple clarification du code, ajout de tests unitaires...).

Nous pensons mettre en place de l'intégration continue avec des tests automatiques sur chaque merge request, qui devront être validés pour que la branche proposée puisse être fusionnée dans `main`. Les tests automatiques consisteront probablement en :
- Tests unitaires
- Tests d'intégration
- *Sanitizers* sur tous les tests (détection poussée d'erreurs mémoire, de concurrence et de comportement indéfini du code)


#### Branches de travail
Au lieu de demander à chacun de [forker le projet](https://www.christopheducamp.com/2013/12/16/forker-un-repo-github/) il sera possible de directement travailler sur le répertoire de notre groupe, c'est à dire d'y pousser ses propres branches (ce qui impliquera de faire un peu de nettoyage de temps à autres, probablement en supprimant les branches de travail dès lors qu'elles ont été fusionnées à la branche principale ce que GitLab propose de toute manière par défaut).

Il est à noter que la branche `main` est de toute manière protégée contre le push, ce qui signifie que pour modifier celle-ci il faudra obligatoirement passer par une merge request, assurant ainsi une meilleure qualité du code.


## Choix des technologies à utiliser
Nous avons pris des décisions concernant les technologies que nous comptions utiliser pour notre projet.

Nous utiliserons de multiples technologies mais chaque membre de notre équipe n'aura bien sûr qu'à apprendre, au fur et à mesure, celles qui seront nécessaire à ses tâches. Le salon Discord `#aide-cpp` (sans doute bientôt renommé `#aide-dev`) a d'ailleurs été mis en place afin que nous puissions poser toutes les questions auxquelles nous n'aurions pas trouvé de réponse en ligne. Cette entraide devrait permettre de prévenir tout blocage en raison d'incompréhensions au sujet des technologies utilisées.

### TypeScript + Electron pour le frontend
Déjà évoquée lors de nos discussions sur le serveur Discord, nous avons pu tous ensemble valider l'utilisation de la bibliothèque [Electron](https://www.electronjs.org) avec [TypeScript](https://www.typescriptlang.org) pour le développement de notre front end. Nous avons noté plusieurs avantages :
- Facilité de créer un jeu compatibles avec de multiples systèmes d'exploitation (Linux, macOS, Windows)
- Possibilité de réutiliser notre code presque à l'identique pour la version application web de notre jeu
- Typage fort de TypeScript permettant un code plus rigoureux, une plus grande facilité à résoudre les bugs, et une meilleure autocomplétion dans des IDEs tels que Visual Studio Code.
- Intérêt d'apprendre à maitriser de nouveaux outils, notamment pour notre future vie professionnelle

Nous avons également mentionné, sans prendre de décision définitive, l'utilisation de [Vue.js](https://vuejs.org).

### C++ pour le backend
Nous utiliserons C++ pour notre backend. Nous avions déjà pu discuter des avantages de l'utilisation du C++ lors de [la séance du 19 janvier](https://git.unistra.fr/pi2021-ab/projet-integrateur/-/blob/main/comptes-rendus/seances/19-01-2021-CRS.md).
De nombreux membres de notre équipe ont noté que le C++ leur avait semblé plus approchable que prévu.

Nous avons partagé des liens vers des tutoriels C++ en ligne, notamment:
- [Cours C++ de Tutorialpoint](https://www.tutorialspoint.com/cplusplus/index.htm)
- [Cours C++ de GeeksForGeeks](https://www.tutorialspoint.com/cplusplus/index.htm)
    - [Article de GeeksForGeeks sur les smart pointers](https://www.geeksforgeeks.org/smart-pointers-cpp/)


### CMake pour la compilation du backend
[CMake](https://fr.wikipedia.org/wiki/CMake) est un générateur de système de construction, il permet de définir les dépendances du projet et la façon dont doit être compilé le code avec des concepts de plus haut niveau que Make, [par rapport auquel il a un certain nombre d'avantages](https://stackoverflow.com/a/25790020/2801589). Il est utilisé par de nombreuses entreprises (par exemple Netflix et Apple) ainsi que dans certains projets de masters à l'Université de Strasbourg.

CMake offre également une bonne intégration avec des IDEs comme Visual Studio Code, Xcode et plus. Sa compréhension de haut niveau des différents "modules" de code aide d'ailleurs fortement à l'autocomplétion et le signalement d'erreurs directement dans l'éditeur de texte.

Les membres de notre équipe ont, tout comme pour l'utilisation de TypeScript + Electron, indiqué qu'ils étaient intéressés par l'apprentissage d'une nouvelle technologie qui pourrait être utile dans la suite de leurs études et dans le monde professionnel.

Certains ont déjà eu l'occasion de travailler avec CMake ce qui devrait rendre sa mise en place relativement aisée.

## Gestion du projet
### Cahier des charges
Nous avons discuté du contenu du cahier des charges et nous sommes questionnés sur la nécessité de décrire le thème choisi pour l'adaption que nous ferons du jeu Virus. Il nous a semblé que seules les règles du jeu étaient à inclure et que nous pourrions ultérieurement décider du thème précis de notre adaptation (nous avons d'ailleurs pu rapidement discuter de quelques idées, par exemple le thème virus informatique plutôt que virus biologique, le scénario du jeu sera étudié dans les jours à venir).

Nous prévoyons d'éclaircir ces points auprès de nos professeurs lors de la séance du mardi 26 janvier.

### Timesheet
Nous avons parlé de la possibilité d'utiliser [*Google Sheets*](https://www.google.fr/intl/fr/sheets/about/) ou [*GanttProject*](https://www.ganttproject.biz/download/free#linux) pour le tenue de notre timesheet, nous pensons continuer nos recherches pour trouver quel outil sera le plus adapté.
Il est important que nous commencions au plus vite à remplir notre timesheet afin de garder une trace du travail effectué, sachant que chacun a déjà entamé des formations afin d'apprendre les langages et bibliothèques avec lesquels nous programmerons.

