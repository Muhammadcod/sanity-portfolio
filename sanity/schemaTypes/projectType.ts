
import { defineField, defineType } from 'sanity'

export const projectType = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Short Description',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: 'longDescription',
      title: 'Long Description',
      type: 'text',
      rows: 5,
      description: 'Detailed project description for project detail pages',
    }),
    defineField({
      name: 'image',
      title: 'Main Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
        }
      ],
    }),
    defineField({
      name: 'gallery',
      title: 'Project Gallery',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative Text',
            }
          ],
        }
      ],
    }),
    defineField({
      name: 'technologies',
      title: 'Technologies',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Full Stack', value: 'fullstack' },
          { title: 'Frontend', value: 'frontend' },
          { title: 'Backend', value: 'backend' },
          { title: 'Mobile', value: 'mobile' },
          { title: 'Web App', value: 'webapp' },
          { title: 'Data Visualization', value: 'dataviz' },
          { title: 'E-commerce', value: 'ecommerce' },
          { title: 'Other', value: 'other' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Completed', value: 'completed' },
          { title: 'In Progress', value: 'in-progress' },
          { title: 'Live', value: 'live' },
          { title: 'In Development', value: 'in-development' },
          { title: 'Archived', value: 'archived' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'string',
      validation: (Rule) => Rule.required().regex(/^\d{4}$/, {
        name: 'year',
        invert: false,
      }),
    }),
    defineField({
      name: 'liveUrl',
      title: 'Live URL',
      type: 'url',
      description: 'Link to the live project',
    }),
    defineField({
      name: 'githubUrl',
      title: 'GitHub URL',
      type: 'url',
      description: 'Link to the GitHub repository',
    }),
    defineField({
      name: 'features',
      title: 'Key Features',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'List of key features for detailed project pages',
    }),
    defineField({
      name: 'challenges',
      title: 'Challenges & Solutions (Case Study — The Details)',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Technical challenges faced and how they were solved',
    }),
    defineField({
      name: 'learnings',
      title: 'Key Learnings',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'What was learned from this project',
    }),
    defineField({
      name: 'role',
      title: 'Your Role',
      type: 'string',
      description: 'Case study overlay: e.g. "Lead Frontend Engineer"',
    }),
    defineField({
      name: 'problem',
      title: 'Case Study — The Problem',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Who was this for, and what was broken or missing before it existed?',
    }),
    defineField({
      name: 'approach',
      title: 'Case Study — The Approach',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Key decisions: why this stack, how state and data flow, what you left out.',
    }),
    defineField({
      name: 'buildImage',
      title: 'Case Study — Build Image',
      type: 'image',
      options: { hotspot: true },
      description: 'A UI screenshot or screen-recording still for "The build" section',
      fields: [{ name: 'alt', type: 'string', title: 'Alternative Text' }],
    }),
    defineField({
      name: 'stackLayers',
      title: 'Case Study — Stack Layers',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Layer label for each technology, in the same order as Technologies (e.g. App, Backend, Auth). Used in the stack map.',
    }),
    defineField({
      name: 'result',
      title: 'Case Study — The Result',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Real outcomes only — usage, speed, adoption. Falls back to Key Learnings if empty.',
    }),
    defineField({
      name: 'video',
      title: 'Channel Video',
      type: 'file',
      options: {accept: 'video/*'},
      description: 'Short looping clip (mp4/webm, ideally under 8MB) played on the homepage TV',
    }),
    defineField({
      name: 'featured',
      title: 'Featured Project',
      type: 'boolean',
      description: 'Mark as featured to highlight on homepage',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order in which projects should be displayed (lower numbers first)',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image',
      subtitle: 'category',
    },
  },
})
