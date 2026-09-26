import { jsonLdString } from '@/lib/structured-data'

/** Structured data as a native script tag (not next/script — it isn't executable code). */
export function JsonLd({ graph }: { graph: Record<string, unknown>[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(graph) }} />
}
