const express = require('express');

const app = express();

const PORT = 3000

app.get('/', (req, res) => {
    return res.json({ mesage : `Hello from NodeJS Server ${process.pid}` })
})

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))