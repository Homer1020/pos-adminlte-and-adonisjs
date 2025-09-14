import Rol from '#models/rol'
import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    // admin
    const adminRol = await Rol.create({ name: 'admin', slug: 'admin' })
    const adminUser = await User.findBy('email', 'homermoncallo@gmail.com')
    adminUser?.related('roles').attach([adminRol.id])

    // customer
    await Rol.create({ name: 'customer', slug: 'customer' })
  }
}
