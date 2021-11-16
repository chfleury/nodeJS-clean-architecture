import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http-helper'
import { LoginController } from './login'
import { Authentication, EmailValidator, HttpRequest, HttpResponse } from './login-protocals'

interface SutTypes {
  sut: LoginController
  emailValidatorStub: EmailValidator
  authenticationStub: Authentication
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const authenticationStub = makeAuthentication()
  const sut = new LoginController(emailValidatorStub, authenticationStub)
  return {
    sut,
    emailValidatorStub,
    authenticationStub
  }
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (email: string, password: string): Promise<string> {
      return 'any_token'
    }
  }
  return new AuthenticationStub()
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'any_email',
    password: 'any_password'
  }
})

describe('Login Controller', () => {
  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest: HttpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse: HttpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest: HttpRequest = {
      body: {
        email: 'any_email'
      }
    }
    const httpResponse: HttpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest: HttpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse: HttpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const httpRequest: HttpRequest = makeFakeRequest()

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    await sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email)
  })

  test('Should return 400 if invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const httpRequest: HttpRequest = makeFakeRequest()

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  test('Should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const httpRequest: HttpRequest = makeFakeRequest()

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const httpRequest: HttpRequest = makeFakeRequest()

    const authSpy = jest.spyOn(authenticationStub, 'auth')

    await sut.handle(httpRequest)
    expect(authSpy).toHaveBeenCalledWith(httpRequest.body.email, httpRequest.body.password)
  })

  test('Should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut()
    const httpRequest: HttpRequest = makeFakeRequest()

    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise(resolve => resolve('')))

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(unauthorized())
  })

  test('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    const httpRequest: HttpRequest = makeFakeRequest()

    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 200 and token on Authentication sucess', async () => {
    const { sut } = makeSut()
    const httpRequest: HttpRequest = makeFakeRequest()

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok({ token: 'any_token' }))
  })
})
