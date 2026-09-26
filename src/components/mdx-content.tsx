import * as runtime from 'react/jsx-runtime'

// `code` is NOT user input: it is the function-body string that Velite compiles
// at build time from our own repo-controlled MDX files (content/writing/*.mdx, content/pages/*.mdx).
// Evaluating it with `new Function` is the canonical Velite/Contentlayer render
// pattern. Never pass externally-sourced or user-supplied strings here.
function useMDXComponent(code: string) {
  const fn = new Function(code)
  return fn({ ...runtime }).default
}

export function MDXContent({ code, components }: { code: string; components?: Record<string, React.ComponentType> }) {
  const Component = useMDXComponent(code)
  return <Component components={components} />
}
