# Collecte de metrics avec Prometheus

## Tester en dev

Démarrer les containers nécessaires :

```
docker compose -f compose.yaml -f compose.prometheus.yaml up -d
```

Dans le fichier [`api/.env`](../api/.env),
recopier les variables `PROMETHEUS_*` depuis le fichier [`api/sample.env`](../api/sample.env),
puis passer la variable `PROMETHEUS_ENABLED` à `true`.

Démarrer ou redémarrer l’API.

Visionner les metrics collectées sur Grafana http://localhost:3210/, identifiants par défaut admin/admin.
