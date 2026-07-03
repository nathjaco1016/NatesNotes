import { getCollection, type CollectionEntry } from 'astro:content';

export type Note = CollectionEntry<'notes'>;
export type Course = CollectionEntry<'courses'>;

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Prefix a site-absolute path with the configured base path. */
export function url(path: string): string {
  return base + path;
}

/** Frontmatter title, or a readable fallback derived from the filename slug. */
export function noteTitle(note: Note): string {
  if (note.data.title) return note.data.title;
  return note.id
    .split('/')
    .pop()!
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

/** All published notes, newest first; undated notes last, alphabetically. */
export async function publishedNotes(): Promise<Note[]> {
  const notes = await getCollection('notes', (n) => !n.data.draft);
  return notes.sort((a, b) => {
    if (a.data.date && b.data.date) return b.data.date.valueOf() - a.data.date.valueOf();
    if (a.data.date) return -1;
    if (b.data.date) return 1;
    return noteTitle(a).localeCompare(noteTitle(b));
  });
}

/**
 * A course's notes in manifest order. A manifest slug that matches no
 * published note fails the build — typos should be loud.
 */
export async function courseNotes(course: Course): Promise<Note[]> {
  const notes = await getCollection('notes', (n) => !n.data.draft);
  return course.data.notes.map((slug) => {
    const note = notes.find((n) => n.id === slug);
    if (!note) {
      throw new Error(
        `Course "${course.id}" references note "${slug}", but no published note with that slug exists.`,
      );
    }
    return note;
  });
}

/** Courses that include the given note, for the "Appears in" footer. */
export async function coursesForNote(note: Note): Promise<Course[]> {
  const courses = await getCollection('courses');
  return courses
    .filter((c) => c.data.notes.includes(note.id))
    .sort((a, b) => a.data.title.localeCompare(b.data.title));
}
