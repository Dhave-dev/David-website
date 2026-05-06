import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list'
import { schemaTypes } from './schemas/index.js'

export default defineConfig({
  name: 'david-portfolio',
  title: 'David Ironali — Portfolio CMS',

  projectId: import.meta.env.SANITY_STUDIO_PROJECT_ID || 'yt7ymdxw',
  dataset: import.meta.env.SANITY_STUDIO_DATASET || 'production',

  plugins: [
    structureTool({
      structure: (S, context) =>
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

            orderableDocumentListDeskItem({
              type: 'project',
              title: 'Projects / Case Studies',
              S,
              context,
            }),

            S.listItem()
              .title('Development Projects')
              .child(
                S.documentTypeList('project')
                  .title('Development Projects')
                  .filter('_type == "project" && filterCategory == "development"')
              ),

            S.divider(),

            S.listItem()
              .title('Expertise')
              .schemaType('expertise')
              .child(S.documentTypeList('expertise').title('Expertise Items')),

            S.listItem()
              .title('Testimonials')
              .schemaType('testimonial')
              .child(S.documentTypeList('testimonial').title('Testimonials')),

            S.listItem()
              .title('Brand Logos')
              .schemaType('brandLogo')
              .child(S.documentTypeList('brandLogo').title('Brand Logos')),

            S.divider(),

            S.listItem()
              .title('My Stack')
              .schemaType('stackItem')
              .child(S.documentTypeList('stackItem').title('Stack Items')),

            S.listItem()
              .title('Work Experience')
              .schemaType('workExperience')
              .child(S.documentTypeList('workExperience').title('Work Experience')),

          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
