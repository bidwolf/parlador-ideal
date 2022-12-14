import cookieParser from 'cookie-parser'
import { Router } from 'express'

import createPostController from '../controllers/PostControllers/createPostController'
import deletePostController from '../controllers/PostControllers/deletePostController'
import getPostsByUserId from '../controllers/PostControllers/getPostController'
import getAllPosts from '../controllers/PostControllers/getPosts'
import updatePostController from '../controllers/PostControllers/updatePostController'
// import {
//   ensureAuthenticated as requireAuthentication,
//   ensureAuthenticatedUser as requireUserAuthenticated,     # IMPLEMENTAR NO MOBILE
// } from '../middlewares/EnsureAuthenticated'

const SECRET = process.env.SECRET || ''
const router = Router()
router.get('/',  getAllPosts)
router.post('/:id',  createPostController)
router.get('/:id',  getPostsByUserId)
router.use(cookieParser(SECRET))
router.put('/:id',  updatePostController)
router.delete('/:id',  deletePostController)
export default router
