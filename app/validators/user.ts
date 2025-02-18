import vine from '@vinejs/vine'

export const createUserValidator = vine.compile(
  vine.object({
    full_name: vine.string(),
    email: vine.string().email().unique({
      table: 'users',
      column: 'email',
    }),
    password: vine.string().confirmed({
      confirmationField: 'repeat_password',
    }),
  })
)
