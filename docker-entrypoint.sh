#!/bin/sh
set -e

# Substitute environment variables into the config template
envsubst < /usr/share/nginx/html/env-config.template.js > /usr/share/nginx/html/env-config.js

# Execute the CMD
exec "$@"

