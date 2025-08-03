import vine from '@vinejs/vine'

export const createAttributeValidator = vine.compile(
  vine.object({
    name: vine.string(),
    slug: vine.string(),
    values: vine.array(vine.string()),
    // values: vine.array(vine.unionOfTypes([vine.string(), vine.number()])),
  })
)
