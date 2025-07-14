import vine from '@vinejs/vine'

const category = vine.group([
  vine.group.if((data) => !Number.isNaN(+data.category_id!), {
    category_id: vine.number({ strict: false }).exists({
      table: 'product_categories',
      column: 'id',
    }),
  }),
  vine.group.else({
    category_id: vine.string().trim().minLength(1),
  }),
])

export const createProductValidator = vine.compile(
  vine
    .object({
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
      brand_id: vine.number().exists({
        table: 'brands',
        column: 'id',
      }),
      values: vine.array(vine.number()).optional(),
      images: vine
        .array(
          vine.file({
            size: '2mb',
            extnames: ['png', 'jpg', 'jpeg', 'webp'],
          })
        )
        .optional(),
    })
    .merge(category)
)
