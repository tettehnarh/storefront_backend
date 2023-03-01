import jwt from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'

const tokenSecret: string = process.env.TOKEN_SECRET as string

export const verifyAuthToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorizationHeader = req.headers.authorization as string
    const token = authorizationHeader.split(' ')[1]
    jwt.verify(token, tokenSecret)
    next()
    return
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized access' })
  }
}

export const createJWTToken = (id: number, user_name: string): string => {
  return jwt.sign({ id, user_name }, tokenSecret)
}
