import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Notes are plain markdown files in the vault's notes/ folder.
// All frontmatter is optional so bare Obsidian notes still build.
const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/notes' }),
  schema: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    date: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

// A course is an ordered playlist of note slugs. Notes never reference
// courses; membership lives entirely in these manifests.
const courses = defineCollection({
  loader: glob({ pattern: '**/*.{yaml,yml}', base: './content/courses' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    notes: z.array(z.string()),
  }),
});

export const collections = { notes, courses };
