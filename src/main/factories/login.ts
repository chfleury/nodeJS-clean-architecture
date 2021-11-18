import { DbAuthentication } from '../../data/usecases/authentication/db-authentication'
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter'
import { JwtAdapter } from '../../infra/criptography/jwt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { LogMongoRepository } from '../../infra/db/mongodb/log-repository/log'
import { LoginController } from '../../presentation/controllers/login/login'
import { Controller } from '../../presentation/protocols'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'
import LogControllerDecorator from '../decorators/log'
import env from '../config/env'

export const makeLoginController = (): Controller => {
  const bcryptAdapter = new BcryptAdapter(12)
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAuthentication = new DbAuthentication(accountMongoRepository, bcryptAdapter, jwtAdapter, accountMongoRepository)
  const emailValidator = new EmailValidatorAdapter()
  const loginController = new LoginController(emailValidator, dbAuthentication)
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(loginController, logMongoRepository)
}
