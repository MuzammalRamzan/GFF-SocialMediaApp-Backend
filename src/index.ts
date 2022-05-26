import Express from 'express';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger.json';
import { authRouter } from './api/auth/authRouter';
import { userRouter } from './api/user/userRouter';
import { transactionAccRouter } from './api/transaction-account/transactionAccRouter';
import { transactionCategoryRouter } from './api/transaction-category/transactionCategoryRouter';

const options = {
  swaggerOptions: {
    filter: true
  }
};

(async function main (): Promise<void> {
  const app = Express()

  app.use(bodyParser.json())
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));
  app.use('/auth', authRouter)
  app.use('/user', userRouter)
  app.use('/transactionAccount', transactionAccRouter)
  app.use('/transactionCategory', transactionCategoryRouter)

  app.listen(process.env.PORT, () => {
    console.log(`Server running at port ${process.env.PORT}`)
  })
})().catch((err) => {
  console.log('Error starting application $s', err.message)
  process.exit(1)
})
