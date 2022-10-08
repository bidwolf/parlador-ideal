import { compare as bcrypt_compare } from 'bcrypt'
import { Request, Response } from 'express'
import { sign as jwt_sign } from 'jsonwebtoken'
import { ObjectId } from 'mongoose'

import { generateToken } from '../../handlers/generateToken'
import refreshTokenModel from '../../models/refreshToken'
import UserModel, { UserLogin } from '../../models/User'

const validateLogin = async (authUser: UserLogin) => {
  const user = await UserModel.findOne<UserLogin>({ email: authUser.email })
  if (!user) {
    throw { code: 404, message: 'Email invalid!' }
  }
  const checkPassword = await bcrypt_compare(authUser.password, user.password)
  if (!checkPassword) {
    throw { code: 422, message: 'Invalid password!' }
  }
}
const createRefreshToken = async (tokenId: ObjectId, email: string) => {
  const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || ''
  const user = await UserModel.findOne({ email }, '-password')
  const token = jwt_sign({ id: user?._id }, REFRESH_TOKEN_SECRET, {
    subject: user?.id,
    expiresIn: '30s',
  })
  const refreshToken = await refreshTokenModel.findById(tokenId)
  if (!refreshToken) {
    const newRefreshToken = await refreshTokenModel.create({
      user,
      expiresAt: Date.now(),
      token,
    })
    return user?.updateOne({ $set: { refreshToken: newRefreshToken } })
  }
  return refreshToken?.updateOne({ $set: { token: token } })
}
// deleta um refresh token salvo no cache do navegador
export default async function login(
  req: Request,
  res: Response
): Promise<Response> {
  // Caso o usuário esteja fazendo logout
  const authUser: UserLogin = req.body
  const user = await UserModel.findOne({ email: authUser.email }).select(
    'email -_id'
  )
  const SECRET = process.env.SECRET || ''
  await validateLogin(authUser)
  // Verifica se existe um usuário com o email solicitado
  try {
    const token = generateToken(user?.id, '60s', SECRET)
    // Salvando TOKEN de acesso e REFRESH_TOKEN
    if (user?.refreshToken) {
      const refreshToken = await createRefreshToken(
        user.refreshToken._id,
        authUser.email
      )
      return res.status(200).json({
        code: 200,
        message: 'Authentication done successfully',
        token,
        user,
        refreshToken,
      })
    } else {
      const newRefreshToken = await refreshTokenModel.create({
        user,
        expiresAt: Date.now(),
        token,
      })
      await user?.updateOne({ $set: { refreshToken: newRefreshToken } })
      return res.status(200).json({
        code: 200,
        message: 'Authentication done successfully',
        token,
        user,
      })
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      code: 500,
      message: 'Something was wrong, please try again later.',
    })
  }
}