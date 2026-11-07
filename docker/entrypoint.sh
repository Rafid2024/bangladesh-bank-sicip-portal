#!/bin/bash

TARGET_PORT=${PORT:-8080}
echo "Starting deployment on port $TARGET_PORT..."

# Update port in nginx config
sed -i -E "s/listen [0-9]+;/listen $TARGET_PORT;/g; s/__PORT__/$TARGET_PORT/g" /etc/nginx/nginx.conf

# Ensure .env file exists
if [ ! -f /var/www/html/.env ]; then
    if [ -f /var/www/html/.env.example ]; then
        cp /var/www/html/.env.example /var/www/html/.env
    else
        touch /var/www/html/.env
    fi
fi

# Ensure APP_KEY is synchronized to .env
if [ -n "$APP_KEY" ]; then
    if grep -q "^APP_KEY=" /var/www/html/.env; then
        sed -i "s|^APP_KEY=.*|APP_KEY=$APP_KEY|" /var/www/html/.env
    else
        echo "APP_KEY=$APP_KEY" >> /var/www/html/.env
    fi
else
    php artisan key:generate --force || true
fi

# Ensure SQLite database exists
mkdir -p /var/www/html/database
if [ ! -f /var/www/html/database/database.sqlite ]; then
    touch /var/www/html/database/database.sqlite
fi

# Ensure storage directories exist
mkdir -p /var/www/html/storage/app/public /var/www/html/storage/framework/cache /var/www/html/storage/framework/sessions /var/www/html/storage/framework/views /var/www/html/storage/logs /var/www/html/bootstrap/cache

# Set permissions
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database /var/www/html/.env
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database
chmod 664 /var/www/html/.env

# Clear any cached config
php artisan optimize:clear || true

# Run database migrations and seeding
echo "Running database migrations..."
php artisan migrate --force || true

echo "Running database seeder..."
php artisan db:seed --force || true

# Link storage
php artisan storage:link || true

echo "Launching Nginx and PHP-FPM via Supervisord on port $TARGET_PORT..."
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
