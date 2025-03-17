import vine from '@vinejs/vine'

export const createProductValidator = vine.compile(
  vine.object({
    name: vine.string(),
    price: vine.number(),
    slug: vine.string().unique(async (db, value, field) => {
      const product = await db
        .from('products')
        .whereNot('id', field.meta.productId || null)
        .where('slug', value)
        .first()
      return !product
    }),
    description: vine.string().optional(),
    category_id: vine.number().exists({
      table: 'product_categories',
      column: 'id',
    }),
    values: vine.record(vine.unionOfTypes([vine.array(vine.number()), vine.number()])).optional(),
    images: vine
      .array(
        vine.file({
          size: '2mb',
          extnames: ['png', 'jpg', 'jpeg', 'webp'],
        })
      )
      .minLength(1),
  })
)
