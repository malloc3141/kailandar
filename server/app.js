const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send('Successfully Connected!');
})

app.listen(4000, () => console.log('Waiting for input...'));