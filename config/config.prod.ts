import { Config } from '../src/intefaces'

const conf: Config = {
  env: "production",
  authKey: 'utk',
  envSecure: true,
  api: {
    backEnd: 'https://rebateonline-api.nexterdigitals-dev.com/api/v1',
    frontEnd: 'https://rebateonline.nexterdigitals-dev.com'
  },
  database: {
    host: 'us-cdbr-east-02.cleardb.com',
    port: 3308,
    username: 'b6be5dcb7c4585',
    password: 'b74854d1',
    database: 'heroku_c6cf77564ca1516',
    type: 'mysql'
  }
}

export default conf
