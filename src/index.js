const express = require('express')
const path = require('path')
const app = express()
const { createProxyMiddleware } = require('http-proxy-middleware');
const port = 3000

app.use('/static', express.static(path.join(__dirname, 'web')))
app.get('/', (req, res) => res.send('Hello World!'))
app.use('/1.0', createProxyMiddleware({ target: 'https://wonapi.maxleap.cn/', changeOrigin: true }));

app.listen(port, () => console.log(`Example app listening on port ${port}!`))