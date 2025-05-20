const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Serwer działa!');
});

app.listen(PORT, () => {
    console.log(`Serwer działa na porcie ${PORT}`);
});
