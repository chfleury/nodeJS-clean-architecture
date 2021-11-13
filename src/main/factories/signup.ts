import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { SingUpController } from '../../presentation/controllers/signup/signup'
import { Controller } from '../../presentation/protocols'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'
import LogControllerDecorator from '../decorators/log'

export const makeSignUpController = (): Controller => {
  const salt = 12
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const accountMongoRepository = new AccountMongoRepository()
  const encrypter = new BcryptAdapter(salt)
  const dbAddAcount = new DbAddAccount(encrypter, accountMongoRepository)

  const signUpController = new SingUpController(emailValidatorAdapter, dbAddAcount)
  return new LogControllerDecorator(signUpController)
}
