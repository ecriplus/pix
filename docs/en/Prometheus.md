# Metrics collection with Prometheus

## Testing in dev

Start the required containers:

```
docker compose -f compose.yaml -f compose.prometheus.yaml up -d
```

In the [`api/.env`](../api/.env) file,
copy the `PROMETHEUS_*` variables from the [`api/sample.env`](../api/sample.env) file,
then set the `PROMETHEUS_ENABLED` variable to `true`.

Start or restart the API.

View the collected metrics on Grafana http://localhost:3210/, default credentials admin/admin.
