import { HttpResponse, HttpRequest } from '../protocols/http'
import { MissingParamError } from '../errors/missing-param-error'
import { badRequest } from '../helpers/http-helper'

export class SingUpController {
  handle (httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email']

    requiredFields.forEach((field) => {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    })

    return { body: {}, statusCode: 500 }
  }
}
