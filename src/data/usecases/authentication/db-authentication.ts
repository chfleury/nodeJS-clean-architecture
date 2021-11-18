import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { Authentication } from '../../../domain/usecases/authentication'
import { HashComparer } from '../../protocols/cryptography/hash-comparer'

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository
  private readonly hashComparer

  constructor (loadAccountByEmailRepository: LoadAccountByEmailRepository, hashComparer: HashComparer) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashComparer = hashComparer
  }

  async auth (email: string, password: string): Promise<string | null> {
    const loadedAccount = await this.loadAccountByEmailRepository.load(email)

    if (!loadedAccount) {
      return null
    }

    await this.hashComparer.compare(password, loadedAccount.password)
    return 't'
  }
}
