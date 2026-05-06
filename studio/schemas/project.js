import { defineType, defineField } from 'sanity'
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list'

export const project = defineType({
  name: 'project',
  title: 'Project / Case Study',
  type: 'document',
  fields: [

    /* ─── Core info ─────────────────────────────────────────────── */
    defineField({
      name: 'title',
      title: 'Project Title',
      type: 'string',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      description: 'e.g. UIUX, Website, Branding, Logo Maker — shown as pills on the case study',
    }),
    defineField({
      name: 'category',
      title: 'Category Label',
      type: 'string',
      description: 'Short label shown on project cards e.g. "UI/UX · Website"',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'filterCategory',
      title: 'Filter Category',
      type: 'string',
      options: {
        list: [
          { title: 'Product Design', value: 'product-design' },
          { title: 'Brand Design',   value: 'brand-design' },
          { title: 'Development',    value: 'development' },
        ],
        layout: 'radio',
      },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'startDate',
      title: 'Start Date',
      type: 'string',
      description: 'e.g. "Sept 2024"',
    }),
    defineField({
      name: 'endDate',
      title: 'End Date',
      type: 'string',
      description: 'e.g. "Dec 2026" — leave blank for ongoing',
    }),
    defineField({
      name: 'client',
      title: 'Client Name',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Short Description',
      type: 'text',
      rows: 3,
      description: 'Shown on the works list page',
    }),
    defineField({
      name: 'liveUrl',
      title: 'Live Site URL',
      type: 'url',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image (cards & works page)',
      type: 'image',
      options: { hotspot: true },
      validation: (R) => R.required(),
    }),

    /* ─── Flexible case study sections ──────────────────────────── */
    defineField({
      name: 'sections',
      title: 'Case Study Sections',
      description: 'Add as many sections as you need — each becomes a sidebar link',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'section',
          title: 'Section',
          fields: [
            defineField({
              name: 'title',
              title: 'Section Title',
              type: 'string',
              description: 'e.g. "Project Overview", "The Real Problem", "What I Learned"',
              validation: (R) => R.required(),
            }),
            defineField({
              name: 'body',
              title: 'Section Intro / Overview',
              type: 'array',
              description: 'Opening paragraph(s) for this section, shown before any subsections',
              of: [
                {
                  type: 'block',
                  styles: [{ title: 'Normal', value: 'normal' }],
                  marks: {
                    decorators: [
                      { title: 'Bold',   value: 'strong' },
                      { title: 'Italic', value: 'em' },
                    ],
                  },
                },
              ],
            }),
            defineField({
              name: 'subsections',
              title: 'Subsections',
              type: 'array',
              description: 'Named sub-topics within this section — e.g. "Color System", "Typography System"',
              of: [
                {
                  type: 'object',
                  name: 'subsection',
                  title: 'Subsection',
                  fields: [
                    defineField({
                      name: 'title',
                      title: 'Subsection Title',
                      type: 'string',
                      description: 'e.g. "Color System", "Typography System"',
                      validation: (R) => R.required(),
                    }),
                    defineField({
                      name: 'body',
                      title: 'Content',
                      type: 'array',
                      of: [
                        {
                          type: 'block',
                          styles: [{ title: 'Normal', value: 'normal' }],
                          marks: {
                            decorators: [
                              { title: 'Bold',   value: 'strong' },
                              { title: 'Italic', value: 'em' },
                            ],
                          },
                        },
                      ],
                    }),
                  ],
                  preview: {
                    select: { title: 'title' },
                  },
                },
              ],
            }),
            defineField({
              name: 'images',
              title: 'Section Images',
              type: 'array',
              of: [
                {
                  type: 'image',
                  options: { hotspot: true },
                  fields: [
                    {
                      name: 'alt',
                      type: 'string',
                      title: 'Alt text',
                    },
                    {
                      name: 'caption',
                      type: 'string',
                      title: 'Caption (optional)',
                    },
                  ],
                },
              ],
              description: 'Images appear below the text in this section',
            }),
          ],
          preview: {
            select: { title: 'title', media: 'images.0' },
            prepare({ title, media }) {
              return { title: title || 'Untitled section', media }
            },
          },
        },
      ],
    }),

    /* ─── Meta ───────────────────────────────────────────────────── */
    orderRankField({ type: 'project' }),
  ],

  preview: {
    select: { title: 'title', subtitle: 'category', media: 'coverImage' },
  },
  orderings: [
    orderRankOrdering,
  ],
})
