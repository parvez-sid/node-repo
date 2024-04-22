const cluster = require('cluster');
const express = require('express');
const numCPUs = require('os').cpus().length;

console.log(cluster.isMaster);

if (cluster.isMaster) {
    console.log(`Primary ${process.pid} is running`);
  
    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }
} else {
    const app = express();
    const PORT = 3000

    app.get('/', (req, res) => {
        return res.json({ mesage : `Hello from NodeJS Server ${process.pid}` })
    })

    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
}