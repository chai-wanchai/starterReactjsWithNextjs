import { Config } from '../src/intefaces'

const conf: Config = {
  env: "development",
  authKey: 'utk',
  envSecure: false,
  api: {
    backEnd: 'http://localhost:5001/api/v1',
    frontEnd: 'http://localhost:5000'
  },
  database: {
    host: 'localhost',
    port: 3308,
    username: 'root',
    password: 'root2',
    database: 'game_prizes',
    type: 'mysql'
  }
}

export default conf