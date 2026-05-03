import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas/index.js'

export default defineConfig({
  name: 'david-portfolio',
  title: 'David Ironali — Portfolio CMS',

  projectId: import.meta.env.SANITY_STUDIO_PROJECT_ID || 'yt7ymdxw',
  dataset: import.meta.env.SANITY_STUDIO_DATASET || 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Site Settings')
              .id('siteSettings')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
              ),
            S.divider(),
            S.listItem()
              .title('Projects / Case Studies')
              .schemaType('project')
              .child(S.documentTypeList('project').title('Projects')),
            S.listItem()
              .title('Testimonials')
              .schemaType('testimonial')
              .child(S.documentTypeList('testimonial').title('Testimonials')),
            S.listItem()
              .title('Brand Logos')
              .schemaType('brandLogo')
              .child(S.documentTypeList('brandLogo').title('Brand Logos')),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
