import { Encrypter } from '../../data/protocols/cryptography/encrypter'
import jwt from 'jsonwebtoken'
import { TokenGenerator } from '../../data/protocols/cryptography/token-generator'
export class JwtAdapter implements Encrypter, TokenGenerator {
  private readonly secret: string
  constructor (secret: string) {
    this.secret = secret
  }

  async encrypt (value: string): Promise<string> {
    const token = jwt.sign({ id: value }, this.secret)
    return token
  }

  async generate (value: string): Promise<string> {
    const token = jwt.sign({ id: value }, this.secret)
    return token
  }
}
