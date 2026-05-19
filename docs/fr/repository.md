
# Repository


## En résumé

* Un repository est une couche d’abstraction au-dessus de la persistance de
  données
* Un repository doit contenir le moins de logique métier possible (être le plus
  « dumb » possible)
* Un repository ne doit pas faire de vérifications de sécurité


## Détails

Le design pattern Repository permet de masquer le choix de persistances. Le code
qui utilise le repository ne doit pas savoir si on utilise une base
relationnelle ou un cache par exemple. L’objectif est de permettre de changer
les choix de persistance sans devoir faire changer le code qui dépend des
repositories. Pour atteindre cet objectif, l’interface d’un repository doit être
indépendante de la couche technique.

Les repositories sont une abstraction pour masquer les problématiques et les
choix lié à la persistance des données. Un représentation simple qui montre
l’intention d’un repository est celle d’une collection. On peut y ajouter des
éléments, en supprimer ou en récupérer.  L’idée c’est qu’on va récupérer un
objet a partir du repository, modifier cet objet et ensuite enregistrer ces
modifications.

Si l’utilisation d’un repository existant ne répond pas complètement au besoin
métier, il est préférable de créer un reposiory à part plutôt que d’injecter un
repository existant.

Un repository n'a pas vocation à faire des vérifications de sécurité.

