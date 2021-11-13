import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import LogControllerDecorator from './log'

const makeControllerStub = (): Controller => {
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

  return new ControllerStub()
}

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
}

const makeSut = (): SutTypes => {
  const controllerStub = makeControllerStub()
  const sut = new LogControllerDecorator(controllerStub)
  return {
    sut,
    controllerStub
  }
}

describe('LogControllerDecorator', () => {
  test('Should call controller handle', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')

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
