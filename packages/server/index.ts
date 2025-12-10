import express from 'express'
import dotenv from 'dotenv'
import router from './routes'
dotenv.config()

const app = express()
app.use(express.json()) // allows access to req.body
app.use(router)

const port = process.env.PORT || 3000

/**
 * NOTES:
 * controller is gateway to the application (through req, resp)
 * service holds the application logic (specific to task (chat api))
 * repository holds the data access code (points) (no http requests)
 * small and focust modules
 */

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
