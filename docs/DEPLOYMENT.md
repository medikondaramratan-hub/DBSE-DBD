# Deployment Guide

The frontend and backend are deployed as separate services. Use a managed PostgreSQL database; do not expose its port publicly.

## 1. Deploy the API

Build from the `backend` directory using its `Dockerfile` (or run `mvn clean package` and start the generated JAR). Configure these environment variables in the hosting provider:

| Variable | Required value |
| --- | --- |
| `DB_HOST` | Managed PostgreSQL host name |
| `DB_PORT` | PostgreSQL port, normally `5432` |
| `DB_NAME` | Database name |
| `DB_USERNAME` | Database user |
| `DB_PASSWORD` | Strong database password |
| `JWT_SECRET` | New Base64 secret generated with `openssl rand -base64 64` |
| `CORS_ALLOWED_ORIGINS` | Exact frontend URL, for example `https://app.example.com` |
| `PORT` | Supplied by the hosting provider, when applicable |

Initialize a new database once, in this order: `database/01_schema.sql`, `database/02_sample_data.sql`, then `database/03_indexes.sql`. The sample data now contains subjects, topics, and questions only; it creates no user accounts or sample attempts.

The API serves on `/api`, so a deployed API root such as `https://api.example.com` exposes sign-in at `https://api.example.com/api/auth/login`.

## 2. Deploy the frontend

Set this build-time variable before running `npm run build` or building the frontend Docker image:

```text
VITE_API_BASE_URL=https://api.example.com/api
```

Deploy the contents of `frontend/dist` to any static host. The included `frontend/Dockerfile` and `nginx.conf` support container deployment and preserve React routes on browser refresh.

## 3. Final checks

1. Visit the deployed frontend URL and register a new account.
2. Sign in with that account and complete a quiz.
3. Confirm browser requests go to the deployed API URL and CORS allows only your frontend domain.
4. Keep `.env` files and production secrets out of source control.
