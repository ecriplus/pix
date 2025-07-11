#language: fr
Fonctionnalité: Gestion des Campagnes

  Contexte:
    Étant donné que je vais sur Pix Orga
    Et que les données de test sont chargées

  Scénario: Je consulte le détail d'une campagne de collecte de profils
    Étant donné que je suis connecté à Pix Orga
    Lorsque je clique sur "Envoi profils Lannister"
    Alors je vois le détail de la campagne "Envoi profils Lannister"
    Lorsque je clique sur "Activité"
    Alors je vois 2 participants
    Lorsque je clique sur "Résultats (0)"
    Alors je vois 0 profils

  Scénario: Je créé une campagne de collecte de profils
    Étant donné que je suis connecté à Pix Orga
    Lorsque je clique sur "Créer une campagne"
    Alors je suis redirigé vers la page "creation"
    Lorsque je saisis "Campagne de l'Ouest" dans le champ "Nom de la campagne"
    Et je clique sur "Collecter les profils Pix des participants"
    Et je clique sur "Non"
    Et je clique sur "Créer la campagne"
    Alors je vois le détail de la campagne "Campagne de l'Ouest"
