import supertest from 'supertest'
import app from '../../server'
import jwt from 'jsonwebtoken'
import { User, UsersModel } from '../../models/users'
import client from '../../database'

const request = supertest(app)

const testUser = new UsersModel()

describe('Testing Users Endpoints.', () => {
  const user = {
    user_name: 'User Name',
    first_name: 'First Name',
    last_name: 'Last Name',
    password: 'userpassword'
  } as User

  const token = jwt.sign(user, process.env.TOKEN_SECRET as string)

  async function Truncate() {
    const conn = await client.connect()
    const sql = `TRUNCATE TABLE orders_products , orders , users , products RESTART IDENTITY;`
    await conn.query(sql)
    conn.release()
  }

  it('GET /user should show all users', async () => {
    await testUser.create(user)
    const response = await request.get('/users').set('Authorization', `Bearer ${token}`)
    expect(response.status).toBe(200)
    await Truncate()
  })

  it('GET /user/:id should show all users', async () => {
    await testUser.create(user)
    const response = await request.get('/user/1').set('Authorization', `Bearer ${token}`)
    expect(response.status).toBe(200)
    await Truncate()
  })

  it('POST /user should create a user', async () => {
    const response = await request.post('/user').set('Authorization', `Bearer ${token}`).send(user)
    expect(response.status).toBe(200)
    await Truncate()
  })

  it('PUT /user should edit a user', async () => {
    await testUser.create(user)
    const editedUser = {
      id: 1,
      user_name: 'Edited User Name',
      first_name: 'Edited First Name',
      last_name: 'Edited Last Name',
      password: 'editeduserpassword'
    } as User
    const response = await request
      .put('/user')
      .set('Authorization', `Bearer ${token}`)
      .send(editedUser)
    expect(response.status).toBe(200)
    await Truncate()
  })

  it('DELETE /user should create a user', async () => {
    await testUser.create(user)
    const newUser = {
      id: 1
    } as User
    const response = await request
      .delete('/user')
      .set('Authorization', `Bearer ${token}`)
      .send(newUser)
    expect(response.status).toBe(200)
    await Truncate()
  })
})
