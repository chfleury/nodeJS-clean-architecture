export default {
  mongoUrl: process.env.MONGO_URL ?? 'mongodb://localhost:27017/clean-node-api',
  port: process.env.PORT ?? 3000,
  jwtSecret: process.env.SECRET ?? '23njyn123679v12n9u8BN*Yy8bYT&VB&YVB21'
}
