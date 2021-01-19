# Contribuer

## Ajouter sa clé SSH à GitLab
SSH est la méthode la plus pratique pour lire et écrire sur le projet Git.

Si `ls ~/.ssh` n'affiche pas `id_rsa` et `id_rsa.pub` alors il vous faut [générer les clés](https://docs.github.com/en/github/authenticating-to-github/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent) (concernant le tutoriel, il n'est pas absolument obligatoire de spécifier un passphrase, on peut le laisser vide et [selon votre cas d'utilisation cela ne déteriore pas forcément la sécurité de façon considérable](https://superuser.com/questions/261361/do-i-need-to-have-a-passphrase-for-my-ssh-rsa-key)).

Une fois les clés générées, copiez le contenu de `id_rsa.pub` (attention de ne pas confondre avec `id_rsa`) et collez-le dans le champ dédié GitLab dans Settings > SSH Keys. Enfin cliquez sur "Add Key".

## Utiliser SSH avec Git
Sur [la page du projet](https://git.unistra.fr/pi2021-ab/projet-integrateur) cliquez sur le bouton Clone en haut à droite et copiez l'adresse **SSH**, vous pouvez ensuite la coller afin de cloner le projet à l'aide de la commande :
```
git clone [adressessh]
```

