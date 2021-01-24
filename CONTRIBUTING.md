# Contribuer

## Ajouter sa clé SSH à GitLab
SSH est la méthode la plus pratique pour lire et écrire sur le projet Git.

Si `ls ~/.ssh` n'affiche pas `id_rsa` et `id_rsa.pub` alors il vous faut [générer les clés](https://docs.github.com/en/github/authenticating-to-github/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent) (concernant le tutoriel, il n'est pas absolument obligatoire de spécifier un passphrase, on peut le laisser vide et [selon votre cas d'utilisation cela ne déteriore pas forcément la sécurité de façon considérable](https://superuser.com/questions/261361/do-i-need-to-have-a-passphrase-for-my-ssh-rsa-key) et cela évite d'avoir à préciser son mot de passe à chaque fois).

Une fois les clés générées, copiez le contenu de `id_rsa.pub` (attention de ne pas confondre avec `id_rsa`) et collez-le dans le champ dédié GitLab dans Settings > SSH Keys. Enfin cliquez sur "Add Key".

## Utiliser SSH avec Git
Sur [la page du projet](https://git.unistra.fr/pi2021-ab/projet-integrateur) cliquez sur le bouton Clone en haut à droite et copiez l'adresse **SSH**, vous pouvez ensuite la coller afin de cloner le projet à l'aide de la commande :
```
git clone [adressessh]
```

Cela clonera le projet dans le répertoire courrant, vous pourrez ainsi commencer à travailler sur le projet en créant des branches et en poussant celles ci vers le repo Git distant.

## Récupérer les changements récents
Le projet sera ammené a évoluer fréquemment, en d'autres termes le code risque de changer à vue d'oeil. Pour cette raison il est important de ne pas oublier de toujours récupérer la version la plus récente des changements effectués par le groupe (à l'aide de `git pull`) avant de créer une branche depuis `main`.
Lorsque l'on travaille sur une branche donnée, il est également important de fréquemment récupérer les changements de la branche `main` (toujours à l'aide de `git pull`) et de fusioner ceux-ci (`git merge main`) dans la branche actuelle pour travailler sur les derniers changements.
En plus de permettre le travail sur du code à jour en termes de fonctionalités et corrections de bug, cela permet aussi de se rendre compte rapidement d'éventuels conflits si plusieurs personnes travaillent sur une même partie du code (par exemple des conflits dus à un changement de fonctionnement du programme ou à la modification des mêmes lignes de code dans un fichier donné). Sans récupérer les changements récents ces problèmes apparaitront au moment de la merge request et seront plus durs à résoudre que s'ils l'avaient été plus tôt.

## Messages de commit
Voici une liste de conseils concernant les sujets et descriptions dans les messages de commit, [extraite d'un article en anglais](https://chris.beams.io/posts/git-commit/):

1. Séparer le sujet du commit et la description par un retour à la ligne, par exemple :
```
Ajouter le menu des préférences

Le menu contient les options suivantes :
- Réglage des effets sonores
- Options d'accessibilité
- Choix du thème couleur
```

2. Rendre le sujet aussi court que possible (on recommande de se limiter à 50 caractères, selon votre terminal il se peut que le texte que vous écrirez après avoir fait `git commit` soit coloré tant qu'il respecte cette limite, voir l'image ci-dessous)
![Capture_d_écran_2021-01-24_à_21.34.50](/uploads/162ea9f0c9ddefa6aa07b201ccf9894f/Capture_d_écran_2021-01-24_à_21.34.50.png)

3. Toujours commencer le sujet par une lettre majuscule

4. Ne pas terminer le sujet par un point

5. Écrire le sujet sous une forme impérative (par exemple `Ajouter le menu principal` ou `Résoudre le bug d'affichage des cartes`)

6. Limiter la largeur du texte de la description (on recommande de ne pas dépasser plus 72 caractères par ligne, parfois le terminal vous aide aussi à ce sujet en effectuant automatiquement les retours à la ligne une fois la limite dépassée)

7. Utiliser la description pour décrire ce qui a été changé et pourquoi cela l'a été fait ainsi, tout en sachant qu'il n'est pas toujours obligé de fournir une description si le changement est très simple

Ce sont plus des conseils que des règles, mais vous remarquerez qu'ils ont tendance a être suivis sur tous les projets open source, certains sont plus importants que d'autres bien sûr (par exemple bien séparer le sujet/titre de la description) alors que sur d'autres ont peut être un peu plus flexibles (ce n'est pas un drame si la limite de 72 caractères est dépassée dans la description, par exemple).
