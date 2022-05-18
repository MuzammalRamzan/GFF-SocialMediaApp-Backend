import Express from 'express'
import bodyParser from 'body-parser'

;(async function main (): Promise<void> {
  const app = Express()

  app.use(bodyParser.json())

  app.listen(process.env.PORT, () => {
    console.log(`Server running at port ${process.env.PORT}`)
  })
})().catch((err) => {
  console.log('Error starting application $s', err.message)
  process.exit(1)
})
