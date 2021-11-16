import { HttpResponse, HttpRequest, Controller } from '../../protocols'
import { MissingParamError, InvalidParamError } from '../../errors'
import { badRequest, ok, serverError } from '../../helpers/http-helper'
import { EmailValidator, AddAccount } from './signup-protocals'

export class SingUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAcount: AddAccount

  constructor (emailValidator: EmailValidator, addAcount: AddAccount) {
    this.emailValidator = emailValidator
    this.addAcount = addAcount
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = [
        'name',
        'email',
        'password',
        'passwordConfirmation'
      ]

      const body = httpRequest.body

      for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i]
        if (!body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      if (body.password !== body.passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      if (!this.emailValidator.isValid(body.email)) {
        return badRequest(new InvalidParamError('email'))
      }

      const acc = await this.addAcount.add({
        name: body.name,
        email: body.email,
        password: body.password
      })

      return ok(acc)
    } catch (err: any) {
      return serverError(err)
    }
  }
}
