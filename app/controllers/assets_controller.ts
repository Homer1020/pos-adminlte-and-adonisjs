import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { normalize, sep } from 'node:path'

export default class AssetsController {
  private PATH_TRAVERSAL_REGEX: RegExp = /(?:^|[\\/])\.\.(?:[\\/]|$)/

  index({ request, response }: HttpContext) {
    const filePath = request.param('*').join(sep)
    const normalizedPath = normalize(filePath)

    if (this.PATH_TRAVERSAL_REGEX.test(normalizedPath)) {
      return response.badRequest('Malformed path')
    }

    const absolutePath = app.makePath('storage/uploads', normalizedPath)
    return response.download(absolutePath)
  }
}
