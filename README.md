# Fleetify Technical Test - Multi-Step Invoice Generator



## Quick Start

### Prerequisites
- Docker & Docker Compose installed

### Run Application

```bash
docker-compose up --build
```

This will:
- Start PostgreSQL database
- Create tables and seed master data automatically
- Start Go backend on http://localhost:8080/api
- Start Next.js frontend on http://localhost:3000

### Login Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | admin | admin123 |
| Kerani | kerani | kerani123 |

## Webhook Testing (Bonus Feature)

Webhook is configured to send invoice data to webhook after successful creation.

Default webhook URL: https://sunny-dog-83.webhook.cool

To use different webhook URL:
1. Update `WEBHOOK_URL` in docker-compose.yml
2. Restart backend: `docker-compose restart backend`

## Testing with Postman

Postman collection included: `fleetify-technical.postman_collection.json`

- Set `base_url` variable to `http://localhost:8080/api`
- Use "login admin" or "login kerani" to get JWT token
- Collection auto-saves token for protected endpoints

## Environment Variables

```yaml
Backend:
  DB_HOST: db
  DB_PORT: 5432
  DB_USER: user
  DB_PASSWORD: password
  DB_NAME: fleetify_db
  WEBHOOK_URL: https://sunny-dog-83.webhook.cool

Frontend:
  NEXT_PUBLIC_API_URL: http://localhost:8080/api
```

## Stop Application

```bash
docker-compose down
```

Remove all data (volumes):
```bash
docker-compose down -v
```

