import { EmailValidatorAdapter } from './email-validator'

describe('EmailValidator Adapter', () => {
  test('Should return false if validator retuns false', () => {
    const sut = new EmailValidatorAdapter()

    const isValid = sut.isValid('invalid@mail.com')

    expect(isValid).toBe(false)
  })
})
