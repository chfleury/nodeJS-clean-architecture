import { SingUpController } from './signup'
import { MissingParamError } from '../errors/missing-param-error'

describe('SignUp Controller', () => {
  test('Should return 400 if no name is provided', () => {
    const sut = new SingUpController()

    const httpRequest = {
      body: {
        // name: 'any_name',
        email: 'any_email@mail.com',
        password: '123',
        passwordConfirmation: '123'
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(
      new MissingParamError('Missing param: name')
    )
  })

  test('Should return 400 if no email is provided', () => {
    const sut = new SingUpController()

    const httpRequest = {
      body: {
        name: 'any_name',
        // email: 'any_email@mail.com',
        password: '123',
        passwordConfirmation: '123'
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(
      new MissingParamError('Missing param: email')
    )
  })
})
