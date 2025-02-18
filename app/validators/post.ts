import vine from '@vinejs/vine'

export const createPostValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(6),
    slug: vine.string().trim().unique({
      table: 'posts',
      column: 'slug',
    }),
    excerpt: vine.string().trim().escape(),
    category_id: vine.string().exists({
      table: 'categories',
      column: 'id',
    }),
    content: vine.string(),
  })
)
