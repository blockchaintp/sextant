#!/bin/bash 

CERT_DIRECTORY=${1}
if [ -z "$CERT_DIRECTORY" ]; then
	echo $0 '<target directory>'
	exit 1
fi

CERT_NAME=${2:-self_signed}
PASSWORD=$(openssl rand -hex 16)

set -e
openssl genrsa -des3 -passout pass:${PASSWORD} -out ${CERT_DIRECTORY}/${CERT_NAME}.pass.key 2048

openssl rsa -passin pass:${PASSWORD} -in ${CERT_DIRECTORY}/${CERT_NAME}.pass.key -out ${CERT_DIRECTORY}/${CERT_NAME}.key

rm -f ${CERT_DIRECTORY}/${CERT_NAME}.pass.key

openssl req -new -key ${CERT_DIRECTORY}/${CERT_NAME}.key -out ${CERT_DIRECTORY}/${CERT_NAME}.csr \
    -subj "/C=US/ST=New York/L=New York/O=OrgName/OU=IT Department/CN=example.com"

openssl x509 -req -days 365 -in ${CERT_DIRECTORY}/${CERT_NAME}.csr -signkey ${CERT_DIRECTORY}/${CERT_NAME}.key -out ${CERT_DIRECTORY}/${CERT_NAME}.crt
