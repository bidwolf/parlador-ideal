import { Request, Response } from 'express'

import UserModelDTO from '../../models/User'
export default async function getUser(
  req: Request,
  res: Response
): Promise<Response> {
  const userSlug = req.params.id
  // Verifica se existe um usuário com o id fornecido
  try {
    const user = await UserModelDTO.findById(userSlug).select('name email')
    console.log(user)
    if (!user) {
      throw { code: 404, message: 'Page not found' }
    }
    return res.status(200).json({ code: 200, user })
  } catch (error) {
    return res.status(500).json(error)
  }
}
