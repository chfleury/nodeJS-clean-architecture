import { Authentication, EmailValidator } from './login-protocals'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly authentication: Authentication
  constructor (emailValidator: EmailValidator, authentication: Authentication) {
    this.emailValidator = emailValidator
    this.authentication = authentication
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = [
        'email',
        'password'
      ]

      const requestBody = httpRequest.body

      for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i]
        if (!requestBody[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      if (!this.emailValidator.isValid(requestBody.email)) {
        return badRequest(new InvalidParamError('email'))
      }

      const token = await this.authentication.auth(requestBody.email, requestBody.password)

      if (!token) {
        return unauthorized()
      }

      return ok({ token })
    } catch (err: any) {
      return serverError(err)
    }
  }
}
