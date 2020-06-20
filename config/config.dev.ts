import { Config } from '../src/intefaces'

const conf: Config = {
  env: "development",
  authKey: 'utk',
  envSecure: false,
  api: {
    backEnd: 'http://localhost:5001/api/v1',
    frontEnd: 'http://localhost:5000'
  }
}

export default conf