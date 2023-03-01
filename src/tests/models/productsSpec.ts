import { Product, ProductsModel } from '../../models/products'
import client from '../../database'

const testProduct = new ProductsModel()

describe('Product Model', () => {
  describe('Test methods exists', () => {
    it('index method should be defined', () => {
      expect(testProduct.index).toBeDefined()
    })
    it('show method should be defined', () => {
      expect(testProduct.show).toBeDefined()
    })
    it('create method should be defined', () => {
      expect(testProduct.create).toBeDefined()
    })
    it('edit method should be defined', () => {
      expect(testProduct.edit).toBeDefined()
    })
    it('delete method should be defined', () => {
      expect(testProduct.delete).toBeDefined()
    })
  })

  describe('Test Product model logic', () => {
    const product = {
      product_name: 'New Product 1',
      product_price: 200
    } as Product

    async function Truncate() {
      const conn = await client.connect()
      const sql = `TRUNCATE TABLE orders_products , orders , users , products RESTART IDENTITY;`
      await conn.query(sql)
      conn.release()
    }

    it('should create a Product', async () => {
      const createdProduct: Product = await testProduct.create(product)
      if (createdProduct) {
        expect(createdProduct.product_name).toBe(product.product_name)
        expect(createdProduct.product_price).toBe(product.product_price)
      }
      await Truncate()
    })

    it('index method should show all users in db', async () => {
      await testProduct.create(product)
      const allProducts = await testProduct.index()
      expect(allProducts.length).toBeGreaterThan(0)
      await Truncate()
    })

    it('show method should show a product with id specified', async () => {
      await testProduct.create(product)
      const allProducts = await testProduct.index()
      const addedProductId = allProducts[0].id as number
      const result = await testProduct.show(addedProductId)
      expect(product.product_name).toBe(result.product_name)
      expect(product.product_price).toBe(result.product_price)
      await Truncate()
    })

    it('edit method should edit a product', async () => {
      await testProduct.create(product)
      const editedProduct = {
        product_name: 'New Product 2',
        product_price: 400
      } as Product
      await testProduct.edit(editedProduct)
      const allProducts = await testProduct.index()
      const addedProductId = allProducts[0].id as number
      const newResult = await testProduct.show(addedProductId)
      expect(product.product_name).toBe(newResult.product_name)
      expect(product.product_price).toBe(newResult.product_price)
      await Truncate()
    })

    it('delete method should delete product with id specified', async () => {
      await testProduct.create(product)
      const allProducts = await testProduct.index()
      const addedProductId = allProducts[0].id as number
      await testProduct.delete(addedProductId)
      expect(product.product_name).toBeNull
      expect(product.product_price).toBeNull
      await Truncate()
    })
  })
})
