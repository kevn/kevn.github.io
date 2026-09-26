import { useId, type CSSProperties } from 'react'
import { WORDMARKS } from './wordmark-data'
import { BAND_PERIOD, bandRows, gapRows, type WordmarkText } from '@/lib/wordmark-svg'

/** The banded kev.in mark: Michroma outlines filled with sliding colour bands, cut by thin gaps. */
export function Wordmark({
  text = 'kev.in',
  size,
  className,
  label,
  animated = true,
}: {
  text?: WordmarkText
  size: number
  className?: string
  label?: string
  animated?: boolean
}) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '')
  const { d, width, height } = WORDMARKS[text]
  const slide = { '--band-h': `${BAND_PERIOD}px` } as CSSProperties
  return (
    <svg role="img" aria-label={label ?? text} viewBox={`0 0 ${width} ${height}`} width={+((width / height) * size).toFixed(1)} height={size} className={className}>
      <defs>
        <clipPath id={`wc${id}`}>
          <path d={d} />
        </clipPath>
        <mask id={`wm${id}`}>
          <rect width={width} height={height} fill="#fff" />
          {gapRows(height).map(r => (
            <rect key={r.y} x={0} y={r.y} width={width} height={r.h} fill={r.fill} />
          ))}
        </mask>
      </defs>
      <g clipPath={`url(#wc${id})`} mask={`url(#wm${id})`}>
        <g className={animated ? 'band-slide' : undefined} style={slide}>
          {bandRows(height).map(r => (
            <rect key={`${r.y}${r.fill}`} x={0} y={r.y} width={width} height={r.h} fill={r.fill} />
          ))}
        </g>
      </g>
    </svg>
  )
}
