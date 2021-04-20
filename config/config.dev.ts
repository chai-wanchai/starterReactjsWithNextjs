import { Config } from '../src/intefaces'

const conf: Config = {
  env: "development",
  authKey: 'utk',
  envSecure: false,
  port: '5000',
  zipmexBot: {
    line_id: '@049fjmya',
  },
  api: {
    backEnd: 'http://localhost:8080',
    frontEnd: 'http://localhost:5000'
  }
}

export default conf