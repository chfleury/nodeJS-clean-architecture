import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'

let accountCollection: Collection

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL ?? '')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository()
  }

  test('Should return an account on sucess', async () => {
    const sut = makeSut()

    const account = await sut.add({
      name: 'any_name',
      email: 'any@mail.com',
      password: '123'
    })

    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any@mail.com')
    expect(account.password).toBe('123')
  })

  test('Should return an account on loadByEmail sucess', async () => {
    const sut = makeSut()

    await accountCollection.insertOne({
      name: 'any_name',
      email: 'any@mail.com',
      password: '123'
    })

    const account = await sut.loadByEmail('any@mail.com')
    if (account) {
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any@mail.com')
      expect(account.password).toBe('123')
    }
  })

  test('Should retur null on loadByEmail fail', async () => {
    const sut = makeSut()

    const account = await sut.loadByEmail('any@mail.com')

    expect(account).toBeFalsy()
  })
})
