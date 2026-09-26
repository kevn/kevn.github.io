// Méliès, abstracted: a neon rocket arcs across and lodges in the moon.
// SMIL can't be paused by CSS, so under reduced motion the animated rocket is
// swapped for a static one already lodged at the end of the path.
const PATH = 'M-40 520 C 260 380, 520 80, 900 150 S 1030 176, 1120 188'

function Rocket() {
  return (
    <>
      <path d="M-46 -12 L10 -12 Q40 -12 52 0 Q40 12 10 12 L-46 12 Z" fill="#0c0b1c" stroke="#ff4fd8" strokeWidth={3} />
      <path d="M-30 -12 L-48 -30 L-40 -12 Z M-30 12 L-48 30 L-40 12 Z" fill="#ff4fd8" />
      <circle cx={14} cy={0} r={5} fill="#3ff0ff" />
    </>
  )
}

export function MoonRocket() {
  return (
    <svg aria-hidden="true" viewBox="0 0 1440 700" preserveAspectRatio="xMidYMid meet" className="block h-auto w-full">
      <circle cx={1190} cy={220} r={130} fill="#e8dcc0" style={{ filter: 'drop-shadow(0 0 60px rgb(232 220 192 / .5))' }} />
      <ellipse cx={1139} cy={185} rx={17} ry={7} fill="#8a7a5c" />
      <circle cx={1221} cy={251} r={11} fill="#a8987a" />
      <ellipse cx={1177} cy={274} rx={25} ry={8} fill="#9b8b6d" />
      <path d={PATH} fill="none" stroke="#ff6b35" strokeWidth={3} strokeDasharray="3 14" strokeLinecap="round" opacity={0.8} />
      <g className="hidden motion-safe:inline" style={{ filter: 'drop-shadow(0 0 8px #ff4fd8)' }}>
        <animateMotion dur="7s" repeatCount="indefinite" rotate="auto" keyPoints="0;1;1" keyTimes="0;0.72;1" calcMode="linear" path={PATH} />
        <Rocket />
        <path d="M-50 -6 L-78 0 L-50 6 Z" fill="#ffb000">
          <animate attributeName="d" values="M-50 -6 L-78 0 L-50 6 Z;M-50 -7 L-92 0 L-50 7 Z;M-50 -6 L-78 0 L-50 6 Z" dur=".25s" repeatCount="indefinite" />
        </path>
      </g>
      <g className="motion-safe:hidden" transform="translate(1120 188) rotate(7.6)" style={{ filter: 'drop-shadow(0 0 8px #ff4fd8)' }}>
        <Rocket />
      </g>
    </svg>
  )
}
