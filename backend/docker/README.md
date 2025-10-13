# Docker Setup for Telegram Mini App Backend

This directory contains Docker configurations for running the backend services.

## PostgreSQL Database

### Quick Start

**Using the management script (recommended):**
```bash
cd /Users/vlad/Projects/telegram-mini-app-qs/backend/docker

# Start the database
./manage-docker.sh start

# Check status
./manage-docker.sh status

# View logs
./manage-docker.sh logs

# Connect to database shell
./manage-docker.sh shell

# Stop the database
./manage-docker.sh stop
```

**Using docker-compose directly:**
```bash
cd /Users/vlad/Projects/telegram-mini-app-qs/backend/docker

# Start
docker-compose up -d

# Stop
docker-compose down
```

### Database Configuration

- **Database**: `bazarzhock_db`
- **Username**: `postgresql`
- **Password**: `postgresql`
- **Port**: `5432`
- **Host**: `localhost` (when running locally)

### Accessing the Database

Connect to PostgreSQL using psql:
```bash
docker-compose exec postgres psql -U postgresql -d bazarzhock_db
```

Or using any PostgreSQL client with the connection string:
```
postgresql://postgresql:postgresql@localhost:5432/bazarzhock_db
```

### Data Persistence

Database data is persisted in a Docker volume named `postgres_data`. To completely reset the database:

```bash
docker-compose down -v  # This will remove the volume and all data
docker-compose up -d
```

### Health Check

The PostgreSQL container includes a health check. You can verify it's running:
```bash
docker-compose ps
```

### Logs

View PostgreSQL logs:
```bash
docker-compose logs -f postgres
```

## Management Script

The `manage-docker.sh` script provides convenient commands for managing the PostgreSQL database:

- `./manage-docker.sh start` - Start the database
- `./manage-docker.sh stop` - Stop the database  
- `./manage-docker.sh restart` - Restart the database
- `./manage-docker.sh status` - Show container status
- `./manage-docker.sh logs` - View database logs
- `./manage-docker.sh shell` - Connect to PostgreSQL shell
- `./manage-docker.sh reset` - Reset database (deletes all data)

## Files

- `docker-compose.yml` - Main Docker Compose configuration
- `init.sql` - Database initialization script (runs on first startup)
- `manage-docker.sh` - Convenient management script
- `README.md` - This file