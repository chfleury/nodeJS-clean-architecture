import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'

export default class LogControllerDecorator implements Controller {
  private readonly controller: Controller
  constructor (controller: Controller) {
    this.controller = controller
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const response = await this.controller.handle(httpRequest)
    if (response.statusCode === 500) {
      // log
    }

    return response
  }
}
