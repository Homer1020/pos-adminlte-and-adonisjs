import vine from '@vinejs/vine'

export const createPostValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(6),
    slug: vine
      .string()
      .trim()
      .unique(async (db, value, field) => {
        const post = await db
          .from('posts')
          .whereNot('id', field.meta.postId || null)
          .where('slug', value)
          .first()
        return !post
      }),
    excerpt: vine.string().trim().escape(),
    category_id: vine.string().exists({
      table: 'categories',
      column: 'id',
    }),
    content: vine.string(),
  })
)
