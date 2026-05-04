import { defineType, defineField } from 'sanity'

export const stackItem = defineType({
  name: 'stackItem',
  title: 'Stack Item',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Tool Name',
      type: 'string',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: { hotspot: true },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      description: 'e.g. "Design Tool", "No-Code Tool", "Collaboration Tool"',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Items are shown left-to-right, grouped 3 per row',
      initialValue: 99,
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'category', media: 'logo' },
  },
  orderings: [
    { title: 'Display Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
})
