import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { Authentication } from '../../../domain/usecases/authentication'

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository
  constructor (loadAccountByEmailRepository: LoadAccountByEmailRepository) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
  }

  async auth (email: string, password: string): Promise<string> {
    await this.loadAccountByEmailRepository.load(email)
    return 't'
  }
}
