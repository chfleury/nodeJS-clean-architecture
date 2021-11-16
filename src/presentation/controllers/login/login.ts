import { Authentication } from '../../../domain/usecases/authentication'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, ok, serverError } from '../../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { EmailValidator } from '../signup/signup-protocals'

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

      await this.authentication.auth(requestBody.email, requestBody.password)

      return ok({ ok: 'ok' })
    } catch (err: any) {
      return serverError(err)
    }
  }
}
