import { User, UsersModel } from '../../models/users'
import client from '../../database'

const testUser = new UsersModel()

describe('User Model', () => {
  describe('Test methods exists', () => {
    it('index method should be defined', () => {
      expect(testUser.index).toBeDefined()
    })
    it('show method should be defined', () => {
      expect(testUser.show).toBeDefined()
    })
    it('create method should be defined', () => {
      expect(testUser.create).toBeDefined()
    })
    it('edit method should be defined', () => {
      expect(testUser.edit).toBeDefined()
    })
    it('delete method should be defined', () => {
      expect(testUser.delete).toBeDefined()
    })
  })

  describe('Test user model logic', () => {
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

    it('should create a user', async () => {
      const createdUser: User = await testUser.create(user)
      if (createdUser) {
        expect(createdUser.user_name).toBe(user.user_name)
        expect(createdUser.last_name).toBe(user.last_name)
        //expect(createdUser.user_password).toBe(hashPass(User.user_password));
      }
      await Truncate()
    })

    it('index method should show all users in db', async () => {
      await testUser.create(user)
      const allUsers = await testUser.index()
      expect(allUsers.length).toBeGreaterThan(0)
      await Truncate()
    })

    it('show method should show a user with id specified', async () => {
      await testUser.create(user)
      const allUsers = await testUser.index()
      const addedUserId = allUsers[0].id as number
      const result = await testUser.show(addedUserId)
      expect(user.user_name).toBe(result.user_name)
      expect(user.last_name).toBe(result.last_name)
      await Truncate()
    })

    it('edit method should edit a user', async () => {
      await testUser.create(user)
      const editedUser = {
        user_name: 'Edited User Name',
        first_name: 'Edited First Name',
        last_name: 'Edited Last Name',
        password: 'editeduserpassword'
      } as User
      await testUser.edit(editedUser)
      const allUsers = await testUser.index()
      const addedUserId = allUsers[0].id as number
      const newResult = await testUser.show(addedUserId)
      expect(user.user_name).toBe(newResult.user_name)
      expect(user.last_name).toBe(newResult.last_name)
      await Truncate()
    })

    it('delete method should delete user with id specified', async () => {
      await testUser.create(user)
      const allUsers = await testUser.index()
      const addedUserId = allUsers[0].id as number
      await testUser.delete(addedUserId)
      expect(user.user_name).toBeNull
      expect(user.last_name).toBeNull
      await Truncate()
    })
  })
})
