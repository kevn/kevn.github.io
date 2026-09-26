// Méliès, after "Le Voyage dans la Lune" (1902): a neon rocket arcs across and
// lodges in the eye of the man in the moon, who smiles until the moment of
// impact and then winces. SMIL can't be paused by CSS, so under reduced motion
// the animated rocket and face are swapped for a still of the aftermath.
const PATH = 'M-40 520 C 260 380, 520 80, 900 150 S 1030 176, 1120 188'
const DUR = '7s'
/** Impact happens at 72% of each loop (the rocket's keyTimes below). */
const KEY_TIMES = '0;0.715;0.735;1'

const INK = '#6f5f45'
const SHADE = '#b9a883'
const EYE_WHITE = '#fbf5e4'

function Rocket() {
  return (
    <>
      <path d="M-46 -12 L10 -12 Q40 -12 52 0 Q40 12 10 12 L-46 12 Z" fill="#0c0b1c" stroke="#ff4fd8" strokeWidth={3} />
      <path d="M-30 -12 L-48 -30 L-40 -12 Z M-30 12 L-48 30 L-40 12 Z" fill="#ff4fd8" />
      <circle cx={14} cy={0} r={5} fill="#3ff0ff" />
    </>
  )
}

/** Before impact → after impact, snapping at the moment the rocket lands. */
function Beat({ attr, before, after, animated }: { attr: string; before: string; after: string; animated: boolean }) {
  return animated ? <animate attributeName={attr} values={`${before};${before};${after};${after}`} keyTimes={KEY_TIMES} dur={DUR} repeatCount="indefinite" /> : null
}

const MOUTH = { smile: 'M1166 262 Q1194 280 1224 259', grimace: 'M1166 268 Q1194 254 1224 266' }
const LOWER_LIP = { smile: 'M1172 266 Q1194 282 1218 264', grimace: 'M1172 272 Q1194 262 1218 270' }
const BROW = { calm: 'M1210 168 Q1227 158 1245 167', wince: 'M1210 172 Q1227 166 1245 175' }

/** The man in the moon. `animated`: smiles, then winces on impact. Otherwise: the wince, held. */
function Face({ animated }: { animated: boolean }) {
  const after = !animated
  return (
    // Scaled about the struck eye, so the face fills the disc and the rocket still lands dead-centre.
    <g data-face={animated ? 'animated' : 'still'} className={animated ? 'hidden motion-safe:inline' : 'motion-safe:hidden'} transform="translate(1160 190) scale(1.4) translate(-1160 -190)">
      {/* cheeks and chin, softly shaded */}
      <ellipse cx={1150} cy={232} rx={22} ry={14} fill={SHADE} opacity={0.35} />
      <ellipse cx={1238} cy={230} rx={20} ry={13} fill={SHADE} opacity={0.35} />
      <path d="M1170 300 Q1195 312 1222 299" fill="none" stroke={SHADE} strokeWidth={3} strokeLinecap="round" opacity={0.6} />

      {/* brows */}
      <path data-part="brow" d="M1142 170 Q1160 160 1177 169" fill="none" stroke={INK} strokeWidth={4} strokeLinecap="round" />
      <path data-part="brow" d={after ? BROW.wince : BROW.calm} fill="none" stroke={INK} strokeWidth={4} strokeLinecap="round">
        <Beat attr="d" before={BROW.calm} after={BROW.wince} animated={animated} />
      </path>

      {/* the eye the rocket finds */}
      <g opacity={after ? 0 : 1}>
        <Beat attr="opacity" before="1" after="0" animated={animated} />
        <ellipse data-part="struck-eye" cx={1160} cy={190} rx={15} ry={8} fill={EYE_WHITE} stroke={INK} strokeWidth={1.5} />
        <circle cx={1163} cy={190} r={5} fill="#2c2418" />
      </g>
      {/* moon-dust splash around the impact */}
      <path d="M1148 178 l-10 -9 l14 3 l2 -12 l6 12 l10 -8 l-2 13 l13 1 l-11 7 l9 9 l-13 -2 l-3 12 l-5 -12 l-11 6 l4 -11 z" fill={EYE_WHITE} stroke={SHADE} strokeWidth={1.5} opacity={after ? 1 : 0}>
        <Beat attr="opacity" before="0" after="1" animated={animated} />
      </path>

      {/* the other eye: open, then squeezed shut */}
      <g transform="translate(1227 189)">
        <g data-part="eye" transform={after ? 'scale(1 0.15)' : undefined}>
          {animated && <animateTransform attributeName="transform" type="scale" values="1 1;1 1;1 0.15;1 0.15" keyTimes={KEY_TIMES} dur={DUR} repeatCount="indefinite" />}
          <ellipse rx={15} ry={8} fill={EYE_WHITE} stroke={INK} strokeWidth={1.5} />
          <circle cx={-3} r={5} fill="#2c2418" />
        </g>
        <path d="M-16 1 Q0 7 16 1" fill="none" stroke={INK} strokeWidth={2.5} strokeLinecap="round" opacity={after ? 1 : 0}>
          <Beat attr="opacity" before="0" after="1" animated={animated} />
        </path>
      </g>

      {/* nose */}
      <path data-part="nose" d="M1194 196 Q1190 216 1186 232 Q1194 240 1204 233" fill="none" stroke={INK} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

      {/* lips: a smile, dropping to a grimace */}
      <path data-part="mouth" d={after ? MOUTH.grimace : MOUTH.smile} fill="none" stroke="#8c5e4c" strokeWidth={6} strokeLinecap="round">
        <Beat attr="d" before={MOUTH.smile} after={MOUTH.grimace} animated={animated} />
      </path>
      <path d={after ? LOWER_LIP.grimace : LOWER_LIP.smile} fill="none" stroke="#b07a63" strokeWidth={3.5} strokeLinecap="round" opacity={0.8}>
        <Beat attr="d" before={LOWER_LIP.smile} after={LOWER_LIP.grimace} animated={animated} />
      </path>
    </g>
  )
}

export function MoonRocket() {
  return (
    <svg aria-hidden="true" viewBox="0 0 1440 700" preserveAspectRatio="xMidYMid meet" className="block h-auto w-full">
      <defs>
        <radialGradient id="moon-shade" cx="0.4" cy="0.35" r="0.75">
          <stop offset="0" stopColor="#f6eedb" />
          <stop offset="0.7" stopColor="#e3d6b8" />
          <stop offset="1" stopColor="#c9b993" />
        </radialGradient>
        <clipPath id="moon-disc">
          <circle cx={1190} cy={220} r={128} />
        </clipPath>
      </defs>
      <circle cx={1190} cy={220} r={130} fill="url(#moon-shade)" style={{ filter: 'drop-shadow(0 0 60px rgb(232 220 192 / .5))' }} />
      {/* rim craters */}
      {[
        [1104, 140, 11],
        [1262, 128, 9],
        [1300, 210, 13],
        [1284, 290, 8],
        [1110, 290, 10],
        [1215, 118, 6],
        [1078, 222, 7],
      ].map(([cx, cy, r]) => (
        <g key={`${cx}-${cy}`}>
          <circle cx={cx} cy={cy} r={r} fill={SHADE} opacity={0.6} />
          <circle cx={cx - r * 0.25} cy={cy - r * 0.25} r={r * 0.6} fill="#f3e9d2" opacity={0.5} />
        </g>
      ))}
      <g clipPath="url(#moon-disc)">
        <Face animated />
        <Face animated={false} />
      </g>
      <path d={PATH} fill="none" stroke="#ff6b35" strokeWidth={3} strokeDasharray="3 14" strokeLinecap="round" opacity={0.8} />
      <g className="hidden motion-safe:inline" style={{ filter: 'drop-shadow(0 0 8px #ff4fd8)' }}>
        <animateMotion dur={DUR} repeatCount="indefinite" rotate="auto" keyPoints="0;1;1" keyTimes="0;0.72;1" calcMode="linear" path={PATH} />
        <Rocket />
        <path d="M-50 -6 L-78 0 L-50 6 Z" fill="#ffb000">
          <animate attributeName="d" values="M-50 -6 L-78 0 L-50 6 Z;M-50 -7 L-92 0 L-50 7 Z;M-50 -6 L-78 0 L-50 6 Z" dur=".25s" repeatCount="indefinite" />
        </path>
      </g>
      <g data-rocket="lodged" className="motion-safe:hidden" transform="translate(1120 188) rotate(7.6)" style={{ filter: 'drop-shadow(0 0 8px #ff4fd8)' }}>
        <Rocket />
      </g>
    </svg>
  )
}
