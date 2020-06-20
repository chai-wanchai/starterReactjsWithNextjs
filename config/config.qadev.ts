import { Config } from '../src/intefaces'

const conf: Config = {
  env: "qadev",
  authKey: 'utk',
  envSecure: true,
  api: {
    backEnd: 'https://rebateonline-api.nexterdigitals-dev.com/api/v1',
    frontEnd: 'https://rebateonline.nexterdigitals-dev.com'
  }
}

export default conf
