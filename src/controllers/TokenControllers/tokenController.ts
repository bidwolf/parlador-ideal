import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'

import UserModelDTO from '../../models/User'
const generateToken = (userId: string, expiresIn: string) => {
  const SECRET = process.env.SECRET || ''
  const token = jwt.sign({ id: userId }, SECRET, {
    subject: userId,
    expiresIn: expiresIn,
  })
  return token
}
export async function refreshToken(req: Request, res: Response) {
  const authHeader = req.headers['authorization']
  const [, token] = (authHeader && authHeader.split(' ')) || ['']
  try {
    const jwToken = jwt.decode(token, { json: true })
    if (jwToken && jwToken.sub) {
      const userId = jwToken.sub
      const user = await UserModelDTO.findById(userId, '-password')
      if (!user?.refreshToken) {
        return res.status(400).json({ message: 'unauthorized' })
      }
      const token = generateToken(userId, '30s')
      return res.status(200).json({ token, userId })
    }
  } catch (error) {
    console.error(error)
    return res
      .status(403)
      .json({ code: 403, message: 'Forbidden token.', error })
  }
}