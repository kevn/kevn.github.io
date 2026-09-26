import { PROJECTS, projectHref } from './projects'
import type { Post } from '@/lib/posts'

const p = (kind: Post['kind']) => ({ kind }) as Post

it('links a project to its writing only once posts of that kind exist', () => {
  const fpv = PROJECTS.find(x => x.slug === 'fpv')!
  expect(projectHref(fpv, [])).toBe('/now')
  expect(projectHref(fpv, [p('field-notes')])).toBe('/writing?kind=field-notes')
  const df = PROJECTS.find(x => x.slug === 'deep-fathom')!
  expect(projectHref(df, [])).toBe('https://www.deepfathom.ai')
})
