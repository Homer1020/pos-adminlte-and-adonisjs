import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await User.create({
      fullName: 'Homer Moncayo',
      email: 'homermoncallo@gmail.com',
      password: 'admin123',
    })

    await User.create({
      fullName: 'Usuario',
      email: 'usuario@correo.com',
      password: 'admin123',
    })
  }
}
