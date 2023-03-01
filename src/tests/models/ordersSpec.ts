import { Order, OrdersModel } from '../../models/orders'
import { User, UsersModel } from '../../models/users'
import { Product, ProductsModel } from '../../models/products'

import client from '../../database'

const testOrder = new OrdersModel()
const testUser = new UsersModel()
const testProduct = new ProductsModel()

describe('Order Model', () => {
  describe('Test methods exists', () => {
    it('index method should be defined', () => {
      expect(testOrder.index).toBeDefined()
    })
    it('show method should be defined', () => {
      expect(testOrder.show).toBeDefined()
    })
    it('create method should be defined', () => {
      expect(testOrder.create).toBeDefined()
    })
    it('edit method should be defined', () => {
      expect(testOrder.edit).toBeDefined()
    })
    it('delete method should be defined', () => {
      expect(testOrder.delete).toBeDefined()
    })
  })

  describe('Test Order model logic', () => {
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

    async function Truncate() {
      const conn = await client.connect()
      const sql = `TRUNCATE TABLE orders_products , orders , users , products RESTART IDENTITY;`
      await conn.query(sql)
      conn.release()
    }

    it('should create an order', async () => {
      await testUser.create(user)
      await testOrder.create(order)
      await testProduct.create(product)
      const createdOrder: Order = await testOrder.create(order)
      expect(createdOrder.order_status).toBe(order.order_status)
      expect(createdOrder.user_id).toBe(order.user_id)
      await Truncate()
    })

    it('index method should show all orders in db', async () => {
      await testUser.create(user)
      await testOrder.create(order)
      await testProduct.create(product)
      const createdOrder: Order[] = await testOrder.index()
      expect(createdOrder.length).toBeGreaterThan(0)
      await Truncate()
      await Truncate()
    })

    it('show method should show an Order with id specified', async () => {
      await testUser.create(user)
      await testOrder.create(order)
      const allOrders = await testOrder.index()
      const addedOrderId = allOrders[0].id as number
      await testProduct.create(product)
      const createdOrder: Order = await testOrder.show(addedOrderId)
      expect(createdOrder.order_status).toBe(order.order_status)
      expect(createdOrder.user_id).toBe(order.user_id)
      await Truncate()
    })

    it('edit method should edit an Order', async () => {
      await testUser.create(user)
      await testOrder.create(order)
      await testProduct.create(product)

      const editedOrder = {
        order_status: 'complete',
        user_id: 1
      } as Order
      await testOrder.edit(editedOrder)
      const allOrders = await testOrder.index()
      const addedOrderId = allOrders[0].id as number
      const newResult = await testOrder.show(addedOrderId)
      expect(order.order_status).toBe(newResult.order_status)
      expect(order.user_id).toBe(newResult.user_id)
      await Truncate()
    })

    it('delete method should delete product with id specified', async () => {
      await testUser.create(user)
      await testOrder.create(order)
      await testProduct.create(product)

      await testOrder.create(order)
      const allOrders = await testOrder.index()
      const addedOrderId = allOrders[0].id as number
      await testOrder.delete(addedOrderId)
      expect(order.order_status).toBeNull
      expect(order.user_id).toBeNull
      await Truncate()
    })

    it('add product to order', async () => {
      await testUser.create(user)
      const allUsers = await testUser.index()
      const addedUserId = allUsers[0].id as number

      await testOrder.create(order)
      const allOrders = await testOrder.index()
      const addedOrderId = allOrders[0].id as unknown as string

      await testProduct.create(product)
      await testOrder.index()
      const addedProductId = allOrders[0].id as number

      await testOrder.addProduct(addedOrderId, addedProductId, addedUserId)
      const resultOP = await testOrder.showOrdersProducts()
      expect(resultOP.length).toBeGreaterThan(0)
      await Truncate()
    })
  })
})
