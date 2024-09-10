# Linkedin Clone

## backend
```
mkdir linkedin
cd linkedin
code -r .
npm init -y
npm i express mongoose dotenv mailtrap jsonwebtoken cookie-parser bcryptjs cloudinary
npm i nodemon -D
```

package.json
```
"type": "module",
  "scripts": {
    "dev": "nodemon backend/server.js",
    "start": "node backend/server.js"
  },
```