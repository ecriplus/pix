# e2e tests

## Installation

Installer les dépendances et le browser utilisé par Playwright.

```bash
npm ci
npx playwright install --with-deps chromium
```

> [!NOTE]
> Important: Quand les tests e2e sont exécutés, ils démarrent automatiquement le serveur API et les fronts web.
> Couper vos serveur locaux afin de ne pas avoir de conflit de port.

## Pré-requis

Vous devez avoir démarré les conteneurs Docker Pix au préalable: `docker compose up` (à la racine du monorepo)

## Exécuter en mode Headless

```bash
npm run test
```

## Exécuter en mode UI

```bash
npm run test:ui
```

## Lancer l'enregistreur d'action

Pour faciliter l'écriture des test, playwright propose un utilitaire pour logger les actions utilisateur et générer un scénario.

```bash
npx playwright codegen
```
