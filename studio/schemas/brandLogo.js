import { defineType, defineField } from 'sanity'

export const brandLogo = defineType({
  name: 'brandLogo',
  title: 'Brand Logo',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Brand Name',
      type: 'string',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo Image (SVG or PNG)',
      type: 'image',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
    }),
  ],
  preview: {
    select: { title: 'name', media: 'logo' },
  },
})
