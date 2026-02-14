# Simple BlogPost page

A FastAPI REST API project with PostgreSQL, Alembic migrations, and JWT auth.

## Quick Start (local)

1. Create and activate a virtual environment.

```bash
python3 -m venv fcc_fastapi
source fcc_fastapi/bin/activate
```

2. Install dependencies.

```bash
pip install -r requirements.txt
```

3. Create a `.env` file in the project root.

```env
DATABASE_HOSTNAME=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=fastapi
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

4. Run the API.

```bash
uvicorn app.main:app --reload
```

The API will be available at `http://127.0.0.1:8000` and Swagger UI at `http://127.0.0.1:8000/docs`.

## Database Migrations

Initialize or upgrade the database schema with Alembic:

```bash
alembic upgrade head
```

## Docker

For local development with Docker:

```bash
docker compose -f docker-compose-dev.yml up --build
```

For a production-style run:

```bash
docker compose -f docker-compose-prod.yml up --build
```

## Project Structure

- `app/` - FastAPI app, routers, models, schemas, and auth logic.
- `alembic/` - Alembic migration configuration and versions.
- `requirements.txt` - Python dependencies.
- `Dockerfile` and `docker-compose-*.yml` - container setup.

## License

MIT
