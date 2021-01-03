import { Config } from '../src/intefaces'

const conf: Config = {
  env: "development",
  authKey: 'utk',
  envSecure: false,
  api: {
    backEnd: 'http://localhost:5001/api/v1',
    frontEnd: 'http://localhost:5000'
  },
  database:{
    host: 'localhost',
    port: 5432,
    username: 'admin',
    password: 'root',
    database: 'mysql',
  }
}

export default conf