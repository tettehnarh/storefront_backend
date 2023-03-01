import supertest from 'supertest'
import app from '../../server'
import jwt from 'jsonwebtoken'
import { Order, OrdersModel } from '../../models/orders'
import { User, UsersModel } from '../../models/users'
import { Product, ProductsModel } from '../../models/products'
import client from '../../database'

const request = supertest(app)

const testOrder = new OrdersModel()
const testUser = new UsersModel()
const testProduct = new ProductsModel()

describe('Testing Orders Endpoints.', () => {
  const order = {
    order_status: 'active',
    user_id: 1
  } as Order

  const product = {
    product_name: 'New Product 1',
    product_price: 200
  } as Product

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

  it('GET /orders should show all users', async () => {
    await testUser.create(user)
    await testOrder.create(order)
    await testProduct.create(product)
    await testOrder.create(order)
    const response = await request.get('/orders').set('Authorization', `Bearer ${token}`)
    expect(response.status).toBe(200)
    await Truncate()
  })

  it('GET /order/:id should show specific order', async () => {
    await testUser.create(user)
    await testOrder.create(order)
    const response = await request.get('/order/1').set('Authorization', `Bearer ${token}`)
    expect(response.status).toBe(200)
    await Truncate()
  })

  it('POST /order should create a order', async () => {
    await testUser.create(user)
    await testOrder.create(order)
    const response = await request
      .post('/order')
      .set('Authorization', `Bearer ${token}`)
      .send(order)
    expect(response.status).toBe(200)
    await Truncate()
  })

  it('PUT /order/:id should edit a order', async () => {
    await testUser.create(user)
    await testOrder.create(order)
    await testProduct.create(product)
    const editedOrder = {
      order_status: 'complete',
      user_id: 1
    } as Order
    const response = await request
      .put('/order/1')
      .set('Authorization', `Bearer ${token}`)
      .send(editedOrder)
    expect(response.status).toBe(200)
    await Truncate()
  })

  it('DELETE /order/:id should create a user', async () => {
    await testUser.create(user)
    await testOrder.create(order)
    await testProduct.create(product)
    const response = await request.delete('/order/1').set('Authorization', `Bearer ${token}`)
    expect(response.status).toBe(200)
    await Truncate()
  })
})
