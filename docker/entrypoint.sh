#!/bin/bash
set -e

TARGET_PORT=${PORT:-8080}
sed -i "s/__PORT__/$TARGET_PORT/g" /etc/nginx/nginx.conf

echo "Starting deployment on port $TARGET_PORT..."

# Ensure .env file exists
if [ ! -f /var/www/html/.env ]; then
    if [ -f /var/www/html/.env.example ]; then
        cp /var/www/html/.env.example /var/www/html/.env
    else
        touch /var/www/html/.env
    fi
fi

# Ensure SQLite file exists
if [ ! -f /var/www/html/database/database.sqlite ]; then
    touch /var/www/html/database/database.sqlite
fi

# Ensure storage directories exist and are writable
mkdir -p /var/www/html/storage/app/public /var/www/html/storage/framework/{cache,sessions,views} /var/www/html/storage/logs
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database /var/www/html/.env
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database
chmod 664 /var/www/html/.env

# Generate APP_KEY if empty or needed
if [ -z "$APP_KEY" ]; then
    php artisan key:generate --force || true
fi

# Run database migrations
echo "Running database migrations..."
php artisan migrate --force || true

# Seed database
php artisan db:seed --force || true

# Link storage
php artisan storage:link || true

echo "Launching Nginx and PHP-FPM via Supervisord on port $TARGET_PORT..."
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
