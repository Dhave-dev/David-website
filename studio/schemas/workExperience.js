import { defineType, defineField } from 'sanity'

export const workExperience = defineType({
  name: 'workExperience',
  title: 'Work Experience',
  type: 'document',
  fields: [
    defineField({
      name: 'role',
      title: 'Role / Title',
      type: 'string',
      description: 'e.g. "Lead UX Designer"',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'company',
      title: 'Company',
      type: 'string',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'industry',
      title: 'Industry / Type',
      type: 'string',
      description: 'e.g. "AI Recruitment SaaS" — shown in uppercase next to company name',
    }),
    defineField({
      name: 'startDate',
      title: 'Start Year',
      type: 'string',
      description: 'e.g. "2023" or "Jan 2023"',
    }),
    defineField({
      name: 'endDate',
      title: 'End Year',
      type: 'string',
      description: 'e.g. "2025" — leave blank or type "Present" if currently here',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Short summary of what you did in this role',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 99,
    }),
  ],
  preview: {
    select: { title: 'role', subtitle: 'company' },
    prepare: ({ title, subtitle }) => ({ title, subtitle }),
  },
  orderings: [
    { title: 'Display Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
})
