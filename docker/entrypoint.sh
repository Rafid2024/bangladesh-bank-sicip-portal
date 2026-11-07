#!/bin/bash
set -e

# Port binding for Render (Render supplies $PORT)
TARGET_PORT=${PORT:-8080}
sed -i "s/__PORT__/$TARGET_PORT/g" /etc/nginx/nginx.conf

echo "Starting deployment on port $TARGET_PORT..."

# Ensure SQLite file exists
if [ ! -f /var/www/html/database/database.sqlite ]; then
    touch /var/www/html/database/database.sqlite
fi
chown -R www-data:www-data /var/www/html/database
chmod -R 775 /var/www/html/database

# Ensure storage directories exist and are writable
mkdir -p /var/www/html/storage/app/public /var/www/html/storage/framework/{cache,sessions,views} /var/www/html/storage/logs
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Generate APP_KEY if empty
if [ -z "$APP_KEY" ]; then
    php artisan key:generate --force
fi

# Run database migrations
echo "Running database migrations..."
php artisan migrate --force

# Seed database if users table is empty
php artisan db:seed --force

# Link storage
php artisan storage:link || true

# Optimize cache
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "Configuration cached successfully. Launching Nginx and PHP-FPM via Supervisord..."
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
