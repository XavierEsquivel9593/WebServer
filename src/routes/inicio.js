const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Cafe');
});



module.exports= app;