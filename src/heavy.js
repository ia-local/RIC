const express = require('express');
const serveur = require('../serveur');

const port = 3141;
const app = express();

app.get("/groqCloud", (req, res) => {
    let total = 0;
    for (let i = 0; i < 6_000_000; i++) {
      total++;
    }
    res.send(`The result of the CPU intensive task is ${total}\n`);
  });

  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });

console.log(`worker pid=${process.pid}`);