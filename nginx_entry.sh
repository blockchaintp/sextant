#!/bin/bash -e

set -e

export DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

envsubst \$PORT < /etc/nginx/nginx.template > /etc/nginx/nginx.conf
exec nginx -g 'daemon off;'
