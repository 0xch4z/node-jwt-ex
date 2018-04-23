const express = require('express'),
  bodyParser = require('body-parser'),
  jwt = require('jsonwebtoken'),
  fs = require('fs');

const publicKey = fs.readFileSync('app.rsa.pub');
const privateKey = fs.readFileSync('app.rsa');

const app = express();

app
  .use(bodyParser.json())
  .use((req, res, next) => {
    try {
      const tok = req.get('Authorization').split('Bearer').pop().trim();
      req.user = jwt.verify(tok, publicKey, { algorithm: 'RS256' });
      // public when verifying a token
    } catch (err) {console.log(err)}
    next();
  })
  .get('/foo', (req, res) => res.send('hello'))
  .post('/login', (req, res) => {
    const { username, password } = req.body
    const token = jwt.sign({
      username,
      password
    }, privateKey, { algorithm: 'RS256' });
    // private when issuing a token
    res.json({ token });
  })
  .get('/me', (req, res) => {
    if (req.user == null)
      return res
        .status(401)
        .json({ success: false });

    res.json({
      message: `hello ${req.user.username}!`
    });
  })
  .listen(3000);
