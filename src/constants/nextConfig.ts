import getConfig from 'next/config'
import { PublicRuntime } from '../intefaces'

export const { publicRuntimeConfig } = getConfig()

export default publicRuntimeConfig as PublicRuntime