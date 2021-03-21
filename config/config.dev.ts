import { Config } from '../src/intefaces'

const conf: Config = {
  env: "development",
  authKey: 'utk',
  envSecure: false,
  api: {
    backEnd: 'http://localhost:4000',
    frontEnd: 'http://localhost:5000'
  }
}

export default conf