import { Config } from '../src/intefaces'
import confDev from './config.dev'
import confProd from './config.prod'
import confQaDev from './config.qadev'
import confStaging from './config.staging'

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
    } else if (hostEnv.includes('qadev') || hostEnv.includes('35.187.246.71')) {
      return confQaDev
    } else if (hostEnv.includes('staging') || hostEnv.includes('ip web staging')) {
      return confStaging
    }

    return confProd

  } catch (err) {
    console.error(err)
    return confDev
  }

}

export default getConfig()