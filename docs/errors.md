
# Erreurs


## Contexte

### Côté serveur, dans Pix API

Les différents types d’erreurs :
* Des erreurs métier, la couche `domain` de la Clean archi.
* Des erreurs applicatives, la couche `application` de la Clean archi.
  Ces erreurs sont destinées à être renvoyées aux clients/utilisateurs dans une requête HTTP dédiée.

Les erreurs métier peuvent avoir des correspondances (mapping) en erreurs applicatives
pour être renvoyées aux clients/utilisateurs. Mais ce n'est pas obligatoire.

### Côté client, dans les frontaux

il n'y a qu'un type d'erreur et pas de mapping.


## Pratiques à suivre

Il faut privilégier :
* l'ajout d'une propriété `code` et le traitement côté client, par `code` en
  priorité par rapport à la propriété `status`. Il faut
  réserver les status pour les couches HTTP/réseau hors de l'application.
* l'ajout d'une propriété `meta` pour ajouter des informations supplémentaires lorsque nécessaire
* un nom finissant par `Error` pour standardiser

Il ne faut pas :
* mettre un texte traduit
* mettre un code dans le constructeur qui incite à le changer
* mal utiliser les codes HTTP pour faire de la discrimination entre erreur
* mettre des informations dans le `meta` qui divulgueraient des informations
  menaçant la sécurité des applications (stacktrace de l'erreur indiquant des
  chemins de fichiers sur le conteneur permettant des attaques, des IP de
  conteneurs, des informations sur les utilisateurs trouvés ou non, etc.)


Bon :
```javascript
class AuthenticationKeyExpiredError extends DomainError {
  constructor() {
    super('This authentication key has expired.', 'EXPIRED_AUTHENTICATION_KEY');
  }
}
```

Pas bon :
```javascript
class UncancellableCertificationCenterInvitation extends DomainError {
  constructor(
    message = "L'invitation à ce centre de certification ne peut pas être annulée.",
    code = 'UNCANCELLABLE_CERTIFICATION_CENTER_INVITATION_CODE',
  ) {
    super(message, code);
  }
}
```

Bon :

* Utiliser des erreurs `400`, `401`, `403`, `404` avec optionnellement un `code`
  d'erreur permettant un traitement particulier

Pas bon :

* Utiliser
  `PreconditionFailedError` (status `412`) ou
  `UnprocessableEntityError` (status `422`)
  qui sont des status codes HTTP prévus spécifiquement pour HTTP et ne peuvent
  pas être utilisés dans le cadre de REST
  cf. https://en.wikipedia.org/wiki/List_of_HTTP_status_codes



## Références (ADR, autres docs, PR, etc.)

* [ADR Gestion des erreurs de l'API dans les clients (applications tierces, IHM, etc.) et références](https://github.com/1024pix/pix/blob/dev/docs/adr/0044-gestion-erreurs-i18n-reference.md)
* [List of HTTP status codes](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes)


