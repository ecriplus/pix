#language: fr
Fonctionnalité: Connexion - Déconnexion

  Contexte:
    Étant donné que tous les comptes sont créés

  Scénario: Je suis connecté et ma session expire puis je rejoins une nouvelle page
    Lorsque je suis connecté et mon token expire bientôt
    Alors je suis redirigé vers la page d'accueil de "Daenerys"
    Lorsque j'attends 5000 ms
    Et je vais sur la page "/mes-certifications"
    Alors je suis redirigé vers la page "/connexion"

  Scénario: Je me connecte via un organisme externe alors qu'il y a une personne déjà connectée puis je me déconnecte
    Étant donné que je suis connecté à Pix en tant que "John Snow"
    Et je me connecte sur Pix pour la seconde fois via le GAR
    Alors je suis redirigé vers la page d'accueil de "Daenerys"
    Lorsque je me déconnecte
    Alors je suis redirigé vers la page "/nonconnecte"
