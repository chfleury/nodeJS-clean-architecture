import { HttpResponse, HttpRequest, Controller, EmailValidator } from '../protocols/'
import { MissingParamError, InvalidParamError } from '../errors/'
import { badRequest, serverError } from '../helpers/http-helper'

export class SingUpController implements Controller {
  private readonly emailValidator: EmailValidator
  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = [
        'name',
        'email',
        'password',
        'passwordConfirmation'
      ]

      for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i]
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      if (httpRequest.body.password != httpRequest.body.passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      if (!this.emailValidator.isValid(httpRequest.body.email)) {
        return badRequest(new InvalidParamError('email'))
      }

      return { body: {}, statusCode: 200 }
    } catch (e) {
      return serverError()
    }
  }
}
