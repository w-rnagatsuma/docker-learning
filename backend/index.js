const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())
app.get('/api/hello', (_, res) => res.json({ message: 'Hello from Node API (Docker)' }))
app.listen(3000, () => console.log('API listening on 3000'))
