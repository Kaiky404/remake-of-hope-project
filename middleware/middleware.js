import jwt from 'jsonwebtoken';
import User from '../models/user.js'

export default async function authMiddleware(req, res, next) {
  const token = req.cookies.token
  if (!token) {
    console.warn('No token found in cookies')
    return res.redirect('/auth/login')
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findById(decoded.id)
    if (!user) {
      console.warn('User not found')
      return res.redirect('/auth/login')
    }

    req.user = user

    next();
  } catch (e) {
    console.error(e)
    return res.redirect('/auth/login')
  }
}
