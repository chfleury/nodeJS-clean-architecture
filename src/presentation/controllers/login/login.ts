import { MissingParamError } from '../../errors'
import { badRequest, ok } from '../../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'

export class LoginController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const requestBody = httpRequest.body
    if (!requestBody.email) {
      return await new Promise(resolve => resolve(badRequest(new MissingParamError('email'))))
    }

    return await new Promise(resolve => resolve(ok({ ok: 'ok' })))
  }
}
