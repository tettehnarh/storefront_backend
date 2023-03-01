import { OrdersModel } from '../models/orders'
import { Application, Request, Response } from 'express'
import { verifyAuthToken } from '../middleware/verifyAuthToken'
import { UsersModel } from '../models/users'

const orders = new OrdersModel()
const users = new UsersModel()

const getAllOrders = async (req: Request, res: Response) => {
  try {
    const getOrders = await orders.index()
    res.status(200).send(getOrders)
  } catch (error) {
    res.status(500).json(error)
  }
}

const getSingleOrder = async (_req: Request, res: Response) => {
  try {
    const order = await orders.show(_req.params.id as unknown as number)
    if (!order) {
      res.status(404).json(`No order with this user id exists!`)
    }
    res.status(200).json(order)
  } catch (error) {
    res.status(400).json(error)
  }
}

const createOrder = async (req: Request, res: Response) => {
  const userId = req.body.user_id as unknown as number
  try {
    const user = await users.show(userId)
    if (!user) {
      res.status(404).json(`User with id ${userId} does not exist!`)
    } else {
      const { order_status, user_id } = req.body
      const newOrder = await orders.create(req.body)
      res.status(200).send(newOrder)
    }
  } catch (error) {
    res.status(500).json(error)
  }
}

const editOrder = async (_req: Request, res: Response) => {
  try {
    const order = await orders.show(_req.params.id as unknown as number)
    // Check if order exists
    if (!order) {
      res.status(404).json(`Order does not exist!`)
    } else {
      const orderObject = {
        id: order.id,
        order_status: _req.body.order_status,
        user_id: _req.body.user_id
      }

      // Update order
      const result = await orders.edit(orderObject)
      res.status(200).json(result)
    }
  } catch (error) {
    res.status(500).json(error)
  }
}

const deleteOrder = async (_req: Request, res: Response) => {
  const orderId = _req.params.id as unknown as number
  try {
    const order = await orders.show(orderId)
    // Check if order exists
    if (!order) {
      res.status(404).json(`Order with id ${orderId} does not exist!`)
    } else {
      await orders.delete(orderId)
      res.status(200).json(`Order with id ${orderId} succesfully deleted`)
    }
  } catch (error) {
    res.status(500).json(error)
  }
}

const addProduct = async (_req: Request, res: Response) => {
  const order_id: string = _req.params.id
  const product_id: number = _req.body.product_id
  const order_product_quantity: number = parseInt(_req.body.order_product_quantity)

  try {
    const addedProduct = await orders.addProduct(order_id, product_id, order_product_quantity)
    res.json(addedProduct)
  } catch (err) {
    res.status(400)
    res.json(err)
  }
}

const showOrdersProducts = async (_req: Request, res: Response) => {
  try {
    const getOrders = await orders.showOrdersProducts()
    res.status(200).send(getOrders)
  } catch (error) {
    res.status(500).json(error)
  }
}

const ordersRoutes = (app: Application) => {
  app.get('/orders', verifyAuthToken, getAllOrders)
  app.get('/order/:id', verifyAuthToken, getSingleOrder)
  app.post('/order', verifyAuthToken, createOrder)
  app.put('/order/:id', verifyAuthToken, editOrder)
  app.delete('/order/:id', verifyAuthToken, deleteOrder)
  // Add product in existing order
  app.post('/orders/:id/products', verifyAuthToken, addProduct)
  // Show ordered product in existing order
  app.get('/orders/orderedproducts', verifyAuthToken, showOrdersProducts)
}

export default ordersRoutes
