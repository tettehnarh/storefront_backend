import supertest from 'supertest'
import app from '../../server'
import jwt from 'jsonwebtoken'
import { Product, ProductsModel } from '../../models/products'
import { User, UsersModel } from '../../models/users'
import client from '../../database'

const request = supertest(app)

const testProduct = new ProductsModel()

describe('Testing Products Endpoints.', () => {
  const product = {
    product_name: 'New product 1',
    product_price: 200
  } as Product

  const user = {
    user_name: 'User Name',
    first_name: 'First Name',
    last_name: 'Last Name',
    password: 'userpassword'
  } as User

  const testUser = new UsersModel()

  const token = jwt.sign(user, process.env.TOKEN_SECRET as string)

  async function Truncate() {
    const conn = await client.connect()
    const sql = `TRUNCATE TABLE orders_products , orders , users , products RESTART IDENTITY;`
    await conn.query(sql)
    conn.release()
  }

  it('GET /products should show all users', async () => {
    await testProduct.create(product)
    const response = await request.get('/products').set('Authorization', `Bearer ${token}`)
    expect(response.status).toBe(200)
    await Truncate()
  })

  it('GET /product/:id should show specific user', async () => {
    await testProduct.create(product)
    const response = await request.get('/product/1').set('Authorization', `Bearer ${token}`)
    expect(response.status).toBe(200)
    await Truncate()
  })

  it('POST /product should create a product', async () => {
    await testProduct.create(product)
    const response = await request
      .post('/product')
      .set('Authorization', `Bearer ${token}`)
      .send(product)
    expect(response.status).toBe(200)
    await Truncate()
  })

  it('PUT /product/:id should edit a product', async () => {
    await testUser.create(user)
    await testProduct.create(product)
    const editedUser = {
      product_name: 'New Product 2',
      product_price: 250
    } as Product
    const response = await request
      .put('/product/1')
      .set('Authorization', `Bearer ${token}`)
      .send(editedUser)
    expect(response.status).toBe(200)
    await Truncate()
  })

  it('DELETE /product should create a user', async () => {
    await testUser.create(user)
    await testProduct.create(product)
    const newProduct = {
      id: 1
    } as Product
    const response = await request
      .delete('/product/1')
      .set('Authorization', `Bearer ${token}`)
      .send(newProduct)
    expect(response.status).toBe(200)
    await Truncate()
  })
})
