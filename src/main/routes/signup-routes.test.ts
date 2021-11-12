import request from 'supertest'
import app from '../config/app'

describe('SignUp Routes', () => {
  test('Should return and account on sucess', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Chris',
        email: 'ch@gmail.com',
        password: '123',
        passwordConfirmation: '123'
      })
      .expect(200)
  })
})
