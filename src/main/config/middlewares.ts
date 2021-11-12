import { Express } from 'express'
import { bodyParser, corsMiddleware } from '../middlewares/'

export default (app: Express): void => {
  app.use(bodyParser)
  app.use(corsMiddleware)
}
