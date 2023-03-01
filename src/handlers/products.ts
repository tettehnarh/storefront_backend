import { ProductsModel } from '../models/products'
import { Application, Request, Response } from 'express'
import { verifyAuthToken } from '../middleware/verifyAuthToken'

const products = new ProductsModel()

const getAllProducts = async (req: Request, res: Response) => {
  try {
    const getproducts = await products.index()
    res.status(200).send(getproducts)
  } catch (error) {
    res.status(500).json(error)
  }
}

const getSingleProduct = async (_req: Request, res: Response) => {
  const productId = _req.params.id as unknown as number
  try {
    const product = await products.show(productId)
    if (!product) {
      res.status(404).json(`No product with id ${productId} exists!`)
    }
    res.status(200).json(product)
  } catch (error) {
    res.status(400).json(error)
  }
}

const createproduct = async (req: Request, res: Response) => {
  try {
    const { product_name, product_price } = req.body
    const newproduct = await products.create(req.body)
    res.status(200).send(newproduct)
  } catch (error) {
    res.status(500).json(error)
  }
}

const editproduct = async (_req: Request, res: Response) => {
  try {
    const product = await products.show(_req.params.id as unknown as number)
    // Check if product exists
    if (!product) {
      res.status(404).json(`Product does not exist!`)
    } else {
      const productObject = {
        id: product.id,
        product_name: _req.body.product_name,
        product_price: _req.body.product_price
      }

      // update product
      const result = await products.edit(productObject)
      console.log(result)
      res.status(200).json(result)
    }
  } catch (error) {
    res.status(500).json(error)
  }
}

const deleteproduct = async (_req: Request, res: Response) => {
  const productId = _req.params.id as unknown as number
  try {
    const product = await products.show(productId)
    // Check if product exists
    if (!product) {
      res.status(404).json(`Product with id ${productId} doesnot exist!`)
    } else {
      await products.delete(productId)
      res.status(200).json(`product with id ${productId} succesfully deleted`)
    }
  } catch (error) {
    res.status(500).json(error)
  }
}

const productRoutes = (app: Application) => {
  app.get('/products', getAllProducts)
  app.get('/product/:id', getSingleProduct)
  app.post('/product', verifyAuthToken, createproduct)
  app.put('/product/:id', verifyAuthToken, editproduct)
  app.delete('/product/:id', verifyAuthToken, deleteproduct)
}

export default productRoutes
