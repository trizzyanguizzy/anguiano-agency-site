import { Overpass } from 'next/font/google';
import styles from './UnderConstruction.module.css';

// Overpass is an open-source take on Highway Gothic, the lettering on US road signs.
const overpass = Overpass({ subsets: ['latin'], weight: ['800'], display: 'swap' });

/** The whole home page: a road-work sign, a barricade with blinking lamps, and one line of text. */
export function UnderConstruction() {
  return (
    <main className={styles.page}>
      <svg className={styles.scene} viewBox="0 0 320 330" role="img" aria-label="Road work ahead sign and barricade">
        {/* Sign post */}
        <rect x="152" y="150" width="16" height="170" rx="3" className={styles.post} />

        {/* Diamond road-work sign, gently swaying */}
        <g className={styles.sign}>
          <rect x="68" y="18" width="184" height="184" rx="16" transform="rotate(45 160 110)" className={styles.signFace} />
          <rect x="80" y="30" width="160" height="160" rx="10" transform="rotate(45 160 110)" className={styles.signBorder} />

          {/* Worker with shovel */}
          <g className={styles.ink}>
            <circle cx="148" cy="66" r="10" />
            <path d="M146 80 L158 116" strokeWidth="13" />
            <path d="M158 116 L144 150" strokeWidth="11" />
            <path d="M158 116 L176 146" strokeWidth="11" />
            <path d="M120 156 Q160 136 206 156 Z" stroke="none" />
            <g className={styles.shovel}>
              <path d="M150 88 L176 100" strokeWidth="9" />
              <path d="M164 76 L196 140" strokeWidth="6" />
              <path d="M188 136 L206 130 L208 152 L196 158 Z" stroke="none" />
            </g>
          </g>
        </g>

        {/* Barricade */}
        <g>
          <rect x="34" y="246" width="12" height="76" rx="2" className={styles.leg} />
          <rect x="274" y="246" width="12" height="76" rx="2" className={styles.leg} />
          <rect x="24" y="252" width="272" height="34" rx="4" className={styles.boardWhite} />
          <clipPath id="board">
            <rect x="24" y="252" width="272" height="34" rx="4" />
          </clipPath>
          <g clipPath="url(#board)" className={styles.stripes}>
            {Array.from({ length: 12 }, (_, i) => (
              <path key={i} d={`M${4 + i * 30} 290 L${26 + i * 30} 248 L${42 + i * 30} 248 L${20 + i * 30} 290 Z`} />
            ))}
          </g>
          <rect x="34" y="236" width="12" height="16" rx="2" className={styles.leg} />
          <rect x="274" y="236" width="12" height="16" rx="2" className={styles.leg} />
          <circle cx="40" cy="228" r="11" className={`${styles.lamp} ${styles.lampA}`} />
          <circle cx="280" cy="228" r="11" className={`${styles.lamp} ${styles.lampB}`} />
        </g>
      </svg>

      <h1 className={`${overpass.className} ${styles.title}`}>Under construction</h1>
    </main>
  );
}
