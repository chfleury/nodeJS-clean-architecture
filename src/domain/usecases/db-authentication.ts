import { LoadAccountByEmailRepository } from '../../data/protocols/db/load-account-by-email-repository'
import { Authentication } from './authentication'

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
