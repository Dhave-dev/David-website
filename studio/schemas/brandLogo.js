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
      title: 'Logo Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Upload SVG exported as PNG, or a transparent PNG logo',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'url',
      title: 'Brand Website (optional)',
      type: 'url',
      description: 'Link when someone clicks the logo',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first in the marquee',
      initialValue: 99,
    }),
  ],
  preview: {
    select: { title: 'name', media: 'logo' },
  },
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
})
