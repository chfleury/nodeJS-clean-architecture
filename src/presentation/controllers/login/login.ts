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
      const requestBody = httpRequest.body

      if (!this.emailValidator.isValid(requestBody.email)) {
        return await new Promise(resolve => resolve(badRequest(new InvalidParamError('email'))))
      }

      if (!requestBody.email) {
        return await new Promise(resolve => resolve(badRequest(new MissingParamError('email'))))
      }

      if (!requestBody.password) {
        return await new Promise(resolve => resolve(badRequest(new MissingParamError('password'))))
      }

      await this.authentication.auth(requestBody.email, requestBody.password)

      return await new Promise(resolve => resolve(ok({ ok: 'ok' })))
    } catch (err: any) {
      return serverError(err)
    }
  }
}
