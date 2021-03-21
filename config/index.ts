import { Config } from '../src/intefaces'
import confDev from './config.dev'
import confProd from './config.prod'

const getConfig = (): Config => {
  try {
    const hostEnv = process.env.NODE_ENV === 'development'
      ? 'localhost'
      : process.env.NODE_ENV

    console.log(`NODE_ENV : ${process.env.NODE_ENV}`)
    console.log(`ENVIRONMENT :  ${process.env.ENVIRONMENT}`)

     
    if (hostEnv == null) {
      return confDev
    }

    if (hostEnv.includes('localhost') || hostEnv.includes('127.0.0.1')) {
      return confDev
    }
    return confProd

  } catch (err) {
    console.error(err)
    return confDev
  }

}

export default getConfig()