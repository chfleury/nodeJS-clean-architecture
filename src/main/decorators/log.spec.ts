import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import LogControllerDecorator from './log'

describe('LogControllerDecorator', () => {
  test('Should call controller handle', async () => {
    class ControllerStub implements Controller {
      async handle (httpRequest: HttpRequest): Promise< HttpResponse> {
        const HttpResponse: HttpResponse = {
          statusCode: 200,
          body: {

          }
        }

        return await new Promise(resolve => resolve(HttpResponse))
      }
    }

    const controllerStub = new ControllerStub()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    const sut = new LogControllerDecorator(controllerStub)
    const httpRequest = {
      body: {
        email: 'a@a.com',
        name: 'a',
        password: '1',
        passwordConfirmation: '1'
      }
    }

    await sut.handle(httpRequest)
    expect(handleSpy).toBeCalledWith(httpRequest)
  })
})
