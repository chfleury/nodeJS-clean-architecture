import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { Authentication } from '../../../domain/usecases/authentication'
import { HashComparer } from '../../protocols/cryptography/hash-comparer'
import { TokenGenerator } from '../../protocols/cryptography/token-generator'

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository
  private readonly hashComparer
  private readonly tokenGenerator

  constructor (
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashComparer: HashComparer,
    tokenGenerator: TokenGenerator) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashComparer = hashComparer
    this.tokenGenerator = tokenGenerator
  }

  async auth (email: string, password: string): Promise<string | null> {
    const loadedAccount = await this.loadAccountByEmailRepository.load(email)

    if (!loadedAccount) {
      return null
    }

    if (!await this.hashComparer.compare(password, loadedAccount.password)) { return null }

    return await this.tokenGenerator.generate(loadedAccount.id)
  }
}
