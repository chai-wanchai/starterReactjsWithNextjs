import next from 'next'

const app = next({ dev: process.env.NODE_ENV === 'development' })

export default app