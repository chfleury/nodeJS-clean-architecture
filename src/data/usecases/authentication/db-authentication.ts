import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { Authentication } from '../../../domain/usecases/authentication'
import { HashComparer } from '../../protocols/cryptography/hash-comparer'
import { TokenGenerator } from '../../protocols/cryptography/token-generator'
import { UpdateAcessTokenRepository } from '../../protocols/db/update-acess-token-repository'

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository
  private readonly hashComparer
  private readonly tokenGenerator
  private readonly updateAcessTokenRepository
  constructor (
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashComparer: HashComparer,
    tokenGenerator: TokenGenerator,
    updateAcessTokenRepository: UpdateAcessTokenRepository) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashComparer = hashComparer
    this.tokenGenerator = tokenGenerator
    this.updateAcessTokenRepository = updateAcessTokenRepository
  }

  async auth (email: string, password: string): Promise<string | null> {
    const loadedAccount = await this.loadAccountByEmailRepository.loadByEmail(email)

    if (!loadedAccount) {
      return null
    }

    if (!await this.hashComparer.compare(password, loadedAccount.password)) { return null }

    const generatedToken = await this.tokenGenerator.generate(loadedAccount.id)

    await this.updateAcessTokenRepository.updateAcessToken(loadedAccount.id, generatedToken)

    return generatedToken
  }
}
