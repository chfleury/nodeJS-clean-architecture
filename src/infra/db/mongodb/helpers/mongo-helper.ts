import { MongoClient } from 'mongodb'
import { AccountModel } from '../../../../domain/models/account'
import { AddAccountModel } from '../../../../domain/usecases/add-account'

export const MongoHelper = {
  client: null as unknown as MongoClient,

  async connect (uri: string) {
    this.client = await MongoClient.connect(uri)
  },

  async disconnect () {
    await this.client.close()
  },

  getCollection (name: string): any {
    return this.client.db().collection(name)
  },

  map (id: string, data: AddAccountModel): AccountModel {
    return {
      id,
      name: data.name,
      email: data.email,
      password: data.password
    }
  }
}
