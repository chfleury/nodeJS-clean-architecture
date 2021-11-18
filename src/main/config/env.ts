export default {
  mongoUrl: process.env.MONGO_URL ?? 'mongodb://root:password@localhost:27017/admin',
  port: process.env.PORT ?? 3000,
  jwtSecret: process.env.SECRET ?? '23njyn123679v12n9u8BN*Yy8bYT&VB&YVB21'
}
