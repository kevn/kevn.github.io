/** CRT scanlines (+ vignette at full intensity). Fills the nearest positioned ancestor. */
export function Crt({ intensity }: { intensity: 'full' | 'soft' }) {
  return (
    <div aria-hidden="true">
      {intensity === 'full' ? (
        <>
          <div className="crt" />
          <div className="vignette" />
        </>
      ) : (
        <div className="crt-soft" />
      )}
    </div>
  )
}
