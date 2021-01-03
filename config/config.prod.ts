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
    host: 'localhost',
    port: 5432,
    username: 'admin',
    password: 'root',
    database: 'mysql',
  }
}

export default conf
