import { Config } from '../src/intefaces'

const conf: Config = {
  env: "staging",
  authKey: 'utk',
  envSecure: true,
  api: {
    backEnd: 'http://34.87.140.235/api/v1',
    frontEnd: 'http://35.187.246.71'
  },
  database: {
    host: 'localhost',
    port: 5432,
    username: 'admin',
    password: 'root',
    database: 'game_prizes',
    type: 'mysql'
  }
}

export default conf