import { type SchemaTypeDefinition } from 'sanity'
import { projectType } from './projectType'
import { articleType } from './articleType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [projectType, articleType],
}
