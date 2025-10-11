#!/bin/bash

# Docker management script for Telegram Mini App Backend
# Usage: ./manage-docker.sh [start|stop|restart|status|logs|reset]

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DOCKER_DIR="$SCRIPT_DIR"

case "$1" in
    start)
        echo "🚀 Starting PostgreSQL database..."
        cd "$DOCKER_DIR" && docker-compose up -d
        echo "✅ PostgreSQL is starting up. Use './manage-docker.sh status' to check when it's ready."
        ;;
    stop)
        echo "🛑 Stopping PostgreSQL database..."
        cd "$DOCKER_DIR" && docker-compose down
        echo "✅ PostgreSQL stopped."
        ;;
    restart)
        echo "🔄 Restarting PostgreSQL database..."
        cd "$DOCKER_DIR" && docker-compose restart
        ;;
    status)
        echo "📊 Docker services status:"
        cd "$DOCKER_DIR" && docker-compose ps
        ;;
    logs)
        echo "📋 PostgreSQL logs (last 20 lines):"
        cd "$DOCKER_DIR" && docker-compose logs postgres --tail=20
        ;;
    shell)
        echo "🐚 Connecting to PostgreSQL shell..."
        cd "$DOCKER_DIR" && docker-compose exec -e PGPASSWORD=postgresql postgres psql -U postgresql -d bazarzhock_db
        ;;
    reset)
        echo "⚠️  This will DELETE ALL database data! Are you sure? (y/N)"
        read -r response
        if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
            echo "🗑️  Resetting database..."
            cd "$DOCKER_DIR" && docker-compose down -v
            cd "$DOCKER_DIR" && docker-compose up -d
            echo "✅ Database reset complete."
        else
            echo "❌ Reset cancelled."
        fi
        ;;
    *)
        echo "📖 Usage: $0 {start|stop|restart|status|logs|shell|reset}"
        echo ""
        echo "Commands:"
        echo "  start   - Start PostgreSQL database"
        echo "  stop    - Stop PostgreSQL database"
        echo "  restart - Restart PostgreSQL database"
        echo "  status  - Show running containers status"
        echo "  logs    - Show PostgreSQL logs"
        echo "  shell   - Connect to PostgreSQL shell"
        echo "  reset   - Reset database (deletes all data)"
        exit 1
        ;;
esac