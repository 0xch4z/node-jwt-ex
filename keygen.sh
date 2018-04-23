# generates private key w/ 2048 keysize
openssl genrsa -out app.rsa 2048

# generates public key for private key
openssl rsa -in app.rsa -pubout > app.rsa.pub
