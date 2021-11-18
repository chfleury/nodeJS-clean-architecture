import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise(resolve => resolve('hashed_value'))
  },

  async compare (): Promise<boolean> {
    return await new Promise(resolve => resolve(true))
  }
})
)

const salt = 12
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe('Bcrypt Adapter', () => {
  test('Should call bcrypt with correct values', async () => {
    const sut = makeSut()

    const hashSpy = jest.spyOn(bcrypt, 'hash')

    await sut.encrypt('any_value')
    expect(hashSpy).toHaveBeenLastCalledWith('any_value', salt)
  })

  test('Should return a hash on sucess', async () => {
    const sut = makeSut()

    const hashedValue = await sut.encrypt('any_value')

    expect(hashedValue).toBe('hashed_value')
  })

  test('Should call compare with correct values', async () => {
    const sut = makeSut()

    const compareSpy = jest.spyOn(bcrypt, 'compare')

    await sut.compare('any_value', 'any_hash')
    expect(compareSpy).toHaveBeenLastCalledWith('any_value', 'any_hash')
  })

  test('Should return true on compare sucess', async () => {
    const sut = makeSut()

    const result = await sut.compare('any_value', 'any_hash')
    expect(result).toBe(true)
  })

  test('Should return false on compare fail', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => { return false })

    const result = await sut.compare('any_value', 'any_hash')
    expect(result).toBe(false)
  })

  test('Should throw if compare throws', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => { throw new Error() })

    const result = sut.compare('any_value', 'any_hash')
    await expect(result).rejects.toThrow()
  })
})
