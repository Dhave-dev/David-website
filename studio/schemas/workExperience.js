import { defineType, defineField } from 'sanity'

export const workExperience = defineType({
  name: 'workExperience',
  title: 'Work Experience',
  type: 'document',
  fields: [
    defineField({
      name: 'company',
      title: 'Company',
      type: 'string',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'e.g. "Abuja"',
    }),
    defineField({
      name: 'role',
      title: 'Role / Title',
      type: 'string',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'type',
      title: 'Work Type',
      type: 'string',
      description: 'e.g. "Remote", "On-site", "Hybrid"',
      initialValue: 'Remote',
    }),
    defineField({
      name: 'startDate',
      title: 'Start Date',
      type: 'string',
      description: 'e.g. "April 2024"',
    }),
    defineField({
      name: 'endDate',
      title: 'End Date',
      type: 'string',
      description: 'Leave blank or type "Present" if currently working here',
    }),
    defineField({
      name: 'color',
      title: 'Indicator Color',
      type: 'string',
      description: 'Hex color for the square icon, e.g. #14A800',
      initialValue: '#1B1C1E',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 99,
    }),
  ],
  preview: {
    select: { title: 'company', subtitle: 'role' },
    prepare: ({ title, subtitle }) => ({ title, subtitle }),
  },
  orderings: [
    { title: 'Display Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
})
