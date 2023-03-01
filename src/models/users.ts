import client from '../database'
import bcrypt from 'bcrypt'

export type User = {
  id?: number
  user_name: string
  first_name: string
  last_name: string
  password?: string
}

export class UsersModel {
  async index(): Promise<User[]> {
    try {
      const conn = await client.connect()
      const sql = 'SELECT * FROM users'
      const result = await conn.query(sql)
      conn.release()
      return result.rows
    } catch (error) {
      throw new Error(`Could not retrieve users: ${error}`)
    }
  }

  async show(id: number): Promise<User> {
    try {
      const conn = await client.connect()
      const sql = 'SELECT id, user_name, first_name, last_name FROM users WHERE id=($1)'
      const result = await conn.query(sql, [id])
      conn.release()
      return result.rows[0]
    } catch (error) {
      throw new Error(`Could not retrieve user with id ${id}: ${error}`)
    }
  }

  async create(u: User): Promise<User> {
    try {
      const conn = await client.connect()
      const sql =
        'INSERT INTO users (user_name, first_name, last_name, password) VALUES($1, $2, $3, $4) RETURNING *'
      const hash = bcrypt.hashSync(
        u.password + (process.env.BCRYPT_PASSWORD as string),
        parseInt(process.env.SALT_ROUNDS as string)
      )
      const result = await conn.query(sql, [u.user_name, u.first_name, u.last_name, hash])
      conn.release()
      return result.rows[0]
    } catch (error) {
      throw new Error(`Could not add user ${u.user_name}. Error: ${error}`)
    }
  }

  async edit(u: User): Promise<User> {
    try {
      const conn = await client.connect()
      const sql =
        'UPDATE users SET user_name=($2), first_name=($3), last_name=($4), password=($5)  WHERE id=($1) RETURNING id, user_name, first_name, last_name'
      const hashPassword = bcrypt.hashSync(
        u.password + (process.env.BCRYPT_PASSWORD as string),
        parseInt(process.env.SALT_ROUNDS as string)
      )
      const result = await conn.query(sql, [
        u.id,
        u.user_name,
        u.first_name,
        u.last_name,
        hashPassword
      ])
      conn.release()
      return result.rows[0]
    } catch (error) {
      throw new Error(`Could not update user with id ${u.id}: ${error}`)
    }
  }

  async delete(id: number): Promise<User> {
    try {
      const conn = await client.connect()
      const sql = 'DELETE FROM users WHERE id=($1)'
      const result = await conn.query(sql, [id])
      conn.release()
      return result.rows[0]
    } catch (error) {
      throw new Error(`Could not delete user with id ${id}: ${error}`)
    }
  }
}
