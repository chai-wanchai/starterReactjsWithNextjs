import { Config } from '../src/intefaces'

const conf: Config = {
  env: "production",
  authKey: 'utk',
  envSecure: true,
  api: {
    backEnd: 'http://34.126.93.32:4000',
    frontEnd: 'http://34.126.93.32:5000'
  }
}

export default conf
