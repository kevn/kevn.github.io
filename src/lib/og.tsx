import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { wordmarkSvg } from './wordmark-svg'
import { WORDMARKS } from '@/components/wordmark-data'

export const OG_SIZE = { width: 1200, height: 630 }

/** 1200×630 share card: midnight ground, banded wordmark, title in Michroma. */
export async function ogImage({ kicker, title, stamp }: { kicker: string; title: string; stamp?: string }) {
  const michroma = await readFile(join(process.cwd(), 'public/fonts/Michroma-Regular.ttf'))
  const mark = `data:image/svg+xml;base64,${Buffer.from(wordmarkSvg('kev.in', { height: 96 })).toString('base64')}`
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 72, background: 'radial-gradient(ellipse at 75% 0%, #1d1a4a 0%, #0c0b1c 60%)', color: '#f2ece0', fontFamily: 'Michroma' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={mark} height={96} width={Math.round((WORDMARKS['kev.in'].width / WORDMARKS['kev.in'].height) * 96)} alt="" />
          <div style={{ fontSize: 22, color: '#ff6b35', letterSpacing: 4 }}>{kicker}</div>
        </div>
        <div style={{ display: 'flex', fontSize: title.length > 60 ? 46 : 58, lineHeight: 1.2, maxWidth: 1040 }}>{title}</div>
        <div style={{ display: 'flex', gap: 24, fontSize: 22, color: '#ff4fd8', letterSpacing: 2 }}>
          <span>{stamp ? `WRITTEN ${stamp}` : 'KEVIN HUNT · SIERRA NEVADA'}</span>
          <span style={{ color: '#8bff6b' }}>KEV.IN</span>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: [{ name: 'Michroma', data: michroma, weight: 400, style: 'normal' }] },
  )
}
