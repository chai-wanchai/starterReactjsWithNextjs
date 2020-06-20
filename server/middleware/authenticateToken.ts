import config from '../../config'

export default (req, res, next) => {
  const { cookies } = req

  if (cookies[config.authKey]) {
    return next()
  } else {
    return res.redirect('/login')
  }
}