import { defineType, defineField } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'heroHeadingLine1',
      title: 'Hero Heading — Line 1',
      type: 'string',
      description: 'e.g. "Product & Brand Designer"',
    }),
    defineField({
      name: 'heroHeadingLine2',
      title: 'Hero Heading — Line 2',
      type: 'string',
      description: 'e.g. "AI Products"',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'string',
    }),
    defineField({
      name: 'availableForWork',
      title: 'Available for Work',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'availableBadgeText',
      title: 'Available Badge Text',
      type: 'string',
      initialValue: 'Available for fulltime and Contract Gigs',
    }),
    defineField({
      name: 'aboutBio',
      title: 'About Bio',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'behanceUrl',
      title: 'Behance URL',
      type: 'url',
    }),
    defineField({
      name: 'linkedinUrl',
      title: 'LinkedIn URL',
      type: 'url',
    }),
    defineField({
      name: 'instagramUrl',
      title: 'Instagram URL',
      type: 'url',
    }),
    defineField({
      name: 'email',
      title: 'Contact Email',
      type: 'string',
    }),
    defineField({
      name: 'cvUrl',
      title: 'CV / Resume URL',
      type: 'url',
    }),
    defineField({
      name: 'avatarImage',
      title: 'Profile Avatar',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'portraitImage',
      title: 'About Page Portrait',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Site Settings' }),
  },
})
