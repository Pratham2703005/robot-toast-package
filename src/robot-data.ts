/**
 * Built-in robot SVG images as base64 data URLs
 * These are embedded directly in the package, no external files needed
 */

function svgToDataUrl(svgContent: string): string {
  const encoded = Buffer.from(svgContent, 'utf-8').toString('base64');
  return `data:image/svg+xml;base64,${encoded}`;
}

const ROBOT_SVG = {
  wave: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
  <defs>
    <linearGradient id="roboGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#E2F0FF" />
      <stop offset="100%" stop-color="#B8D8FF" />
    </linearGradient>
  </defs>
  
  <path d="M 25 60 Q 15 65, 20 80" fill="none" stroke="#2B3A55" stroke-width="4" stroke-linecap="round"/>
  <path d="M 75 60 Q 95 45, 85 25" fill="none" stroke="#2B3A55" stroke-width="4" stroke-linecap="round"/>
  
  <rect x="35" y="55" width="30" height="30" rx="8" fill="url(#roboGrad)" stroke="#2B3A55" stroke-width="4"/>
  
  <rect x="25" y="20" width="50" height="35" rx="12" fill="url(#roboGrad)" stroke="#2B3A55" stroke-width="4"/>
  
  <line x1="50" y1="20" x2="50" y2="10" stroke="#2B3A55" stroke-width="4" stroke-linecap="round"/>
  <circle cx="50" cy="8" r="4" fill="#FF6B6B" stroke="#2B3A55" stroke-width="2"/>
  
  <circle cx="40" cy="38" r="4" fill="#2B3A55"/>
  <path d="M 55 38 Q 60 33, 65 38" fill="none" stroke="#2B3A55" stroke-width="3" stroke-linecap="round"/>
</svg>`,

  base: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
  <defs>
    <linearGradient id="roboGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#E2F0FF" />
      <stop offset="100%" stop-color="#B8D8FF" />
    </linearGradient>
  </defs>
  
  <path d="M 25 60 Q 15 70, 25 85" fill="none" stroke="#2B3A55" stroke-width="4" stroke-linecap="round"/>
  <path d="M 75 60 Q 85 70, 75 85" fill="none" stroke="#2B3A55" stroke-width="4" stroke-linecap="round"/>
  
  <rect x="35" y="55" width="30" height="30" rx="8" fill="url(#roboGrad)" stroke="#2B3A55" stroke-width="4"/>
  
  <rect x="25" y="20" width="50" height="35" rx="12" fill="url(#roboGrad)" stroke="#2B3A55" stroke-width="4"/>
  
  <line x1="50" y1="20" x2="50" y2="10" stroke="#2B3A55" stroke-width="4" stroke-linecap="round"/>
  <circle cx="50" cy="8" r="4" fill="#4D96FF" stroke="#2B3A55" stroke-width="2"/>
  
  <circle cx="40" cy="38" r="4" fill="#2B3A55"/>
  <circle cx="60" cy="38" r="4" fill="#2B3A55"/>
  
  <line x1="45" y1="46" x2="55" y2="46" stroke="#2B3A55" stroke-width="3" stroke-linecap="round"/>
</svg>`,

  success: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
  <defs>
    <linearGradient id="roboGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#E2F0FF" />
      <stop offset="100%" stop-color="#B8D8FF" />
    </linearGradient>
  </defs>

  <circle cx="20" cy="20" r="3" fill="#FF6B6B" />
  <rect x="80" y="25" width="6" height="6" fill="#4D96FF" transform="rotate(45 80 25)"/>
  <circle cx="75" cy="10" r="2" fill="#FFD93D" />

  <path d="M 25 55 Q 10 40, 20 20" fill="none" stroke="#2B3A55" stroke-width="4" stroke-linecap="round"/>
  <path d="M 75 55 Q 90 40, 80 20" fill="none" stroke="#2B3A55" stroke-width="4" stroke-linecap="round"/>
  
  <rect x="35" y="50" width="30" height="30" rx="8" fill="url(#roboGrad)" stroke="#2B3A55" stroke-width="4"/>
  
  <rect x="25" y="15" width="50" height="35" rx="12" fill="url(#roboGrad)" stroke="#2B3A55" stroke-width="4"/>
  
  <line x1="50" y1="15" x2="50" y2="5" stroke="#2B3A55" stroke-width="4" stroke-linecap="round"/>
  <circle cx="50" cy="3" r="4" fill="#4ECB71" stroke="#2B3A55" stroke-width="2"/>
  
  <path d="M 35 32 Q 40 25, 45 32" fill="none" stroke="#2B3A55" stroke-width="3" stroke-linecap="round"/>
  <path d="M 55 32 Q 60 25, 65 32" fill="none" stroke="#2B3A55" stroke-width="3" stroke-linecap="round"/>
</svg>`,

  error: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
  <defs>
    <linearGradient id="roboGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#E2F0FF" />
      <stop offset="100%" stop-color="#B8D8FF" />
    </linearGradient>
  </defs>
  
  <path d="M 85 15 L 95 35 L 75 35 Z" fill="#FF6B6B" stroke="#2B3A55" stroke-width="2" stroke-linejoin="round"/>
  <text x="85" y="32" font-family="sans-serif" font-size="14" fill="#FFF" font-weight="bold" text-anchor="middle">!</text>

  <path d="M 25 55 Q 10 50, 20 35" fill="none" stroke="#2B3A55" stroke-width="4" stroke-linecap="round"/>
  <path d="M 75 60 Q 90 70, 80 85" fill="none" stroke="#2B3A55" stroke-width="4" stroke-linecap="round"/>
  
  <rect x="35" y="55" width="30" height="30" rx="8" fill="url(#roboGrad)" stroke="#2B3A55" stroke-width="4"/>
  
  <rect x="23" y="20" width="50" height="35" rx="12" fill="url(#roboGrad)" stroke="#2B3A55" stroke-width="4"/>
  
  <line x1="48" y1="20" x2="40" y2="10" stroke="#2B3A55" stroke-width="4" stroke-linecap="round"/>
  <circle cx="40" cy="8" r="4" fill="#FF6B6B" stroke="#2B3A55" stroke-width="2"/>
  
  <path d="M 34 34 L 42 42 M 42 34 L 34 42" stroke="#2B3A55" stroke-width="3" stroke-linecap="round"/>
  <path d="M 54 34 L 62 42 M 62 34 L 54 42" stroke="#2B3A55" stroke-width="3" stroke-linecap="round"/>
  
  <path d="M 38 48 L 42 45 L 46 48 L 50 45 L 54 48 L 58 45" fill="none" stroke="#2B3A55" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,

  angry: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
  <defs>
    <linearGradient id="roboGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#E2F0FF" />
      <stop offset="100%" stop-color="#B8D8FF" />
    </linearGradient>
  </defs>

  <path d="M 20 30 Q 10 25, 15 15 Q 25 10, 30 20" fill="none" stroke="#A8B2C1" stroke-width="3" stroke-linecap="round"/>
  <path d="M 80 30 Q 90 25, 85 15 Q 75 10, 70 20" fill="none" stroke="#A8B2C1" stroke-width="3" stroke-linecap="round"/>
  
  <path d="M 25 60 L 15 75" fill="none" stroke="#2B3A55" stroke-width="4" stroke-linecap="round"/>
  <circle cx="15" cy="75" r="5" fill="#2B3A55"/>
  <path d="M 75 60 L 85 75" fill="none" stroke="#2B3A55" stroke-width="4" stroke-linecap="round"/>
  <circle cx="85" cy="75" r="5" fill="#2B3A55"/>
  
  <rect x="35" y="55" width="30" height="30" rx="8" fill="url(#roboGrad)" stroke="#2B3A55" stroke-width="4"/>
  
  <rect x="25" y="25" width="50" height="35" rx="12" fill="url(#roboGrad)" stroke="#2B3A55" stroke-width="4"/>
  
  <line x1="50" y1="25" x2="50" y2="15" stroke="#2B3A55" stroke-width="4" stroke-linecap="round"/>
  <circle cx="50" cy="13" r="4" fill="#FF3333" stroke="#2B3A55" stroke-width="2"/>
  
  <path d="M 32 35 L 48 42" stroke="#2B3A55" stroke-width="4" stroke-linecap="round"/>
  <path d="M 68 35 L 52 42" stroke="#2B3A55" stroke-width="4" stroke-linecap="round"/>
  
  <rect x="40" y="48" width="20" height="6" rx="2" fill="#FFF" stroke="#2B3A55" stroke-width="2"/>
  <line x1="45" y1="48" x2="45" y2="54" stroke="#2B3A55" stroke-width="2"/>
  <line x1="50" y1="48" x2="50" y2="54" stroke="#2B3A55" stroke-width="2"/>
  <line x1="55" y1="48" x2="55" y2="54" stroke="#2B3A55" stroke-width="2"/>
</svg>`,

  angry2: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
  <defs>
    <linearGradient id="roboGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#E2F0FF" />
      <stop offset="100%" stop-color="#B8D8FF" />
    </linearGradient>
  </defs>

  <path d="M 15 30 Q 10 20, 20 15 M 20 35 Q 15 25, 25 20" fill="none" stroke="#FF6B6B" stroke-width="3" stroke-linecap="round" opacity="0.7"/>
  <path d="M 85 30 Q 90 20, 80 15 M 80 35 Q 85 25, 75 20" fill="none" stroke="#FF6B6B" stroke-width="3" stroke-linecap="round" opacity="0.7"/>

  <path d="M 25 60 L 20 80" fill="none" stroke="#2B3A55" stroke-width="4" stroke-linecap="round"/>
  <path d="M 75 60 L 80 80" fill="none" stroke="#2B3A55" stroke-width="4" stroke-linecap="round"/>
  
  <rect x="35" y="55" width="30" height="30" rx="8" fill="url(#roboGrad)" stroke="#2B3A55" stroke-width="4"/>
  
  <rect x="25" y="20" width="50" height="35" rx="12" fill="url(#roboGrad)" stroke="#2B3A55" stroke-width="4"/>
  
  <line x1="50" y1="20" x2="50" y2="10" stroke="#2B3A55" stroke-width="4" stroke-linecap="round"/>
  <circle cx="50" cy="8" r="4" fill="#FF6B6B" stroke="#2B3A55" stroke-width="2"/>
  
  <circle cx="40" cy="38" r="3" fill="#2B3A55"/>
  <circle cx="60" cy="38" r="3" fill="#2B3A55"/>
  <path d="M 32 32 L 45 36 M 68 32 L 55 36" stroke="#2B3A55" stroke-width="4" stroke-linecap="round"/>
  
  <path d="M 40 50 Q 50 44, 60 50" fill="none" stroke="#2B3A55" stroke-width="3" stroke-linecap="round"/>
</svg>`,

  shock: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
  <defs>
    <linearGradient id="roboGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#E2F0FF" />
      <stop offset="100%" stop-color="#B8D8FF" />
    </linearGradient>
  </defs>

  <path d="M 75 15 Q 95 15, 95 30 Q 95 45, 80 45 L 70 50 L 72 42 Q 60 40, 60 30 Q 60 15, 75 15 Z" fill="#FFF" stroke="#2B3A55" stroke-width="3"/>

  <path d="M 25 60 Q 15 70, 30 80" fill="none" stroke="#2B3A55" stroke-width="4" stroke-linecap="round"/>
  <path d="M 75 60 Q 85 40, 70 25" fill="none" stroke="#2B3A55" stroke-width="4" stroke-linecap="round"/>
  
  <rect x="35" y="55" width="30" height="30" rx="8" fill="url(#roboGrad)" stroke="#2B3A55" stroke-width="4"/>
  
  <rect x="25" y="20" width="50" height="35" rx="12" fill="url(#roboGrad)" stroke="#2B3A55" stroke-width="4"/>
  
  <line x1="50" y1="20" x2="50" y2="10" stroke="#2B3A55" stroke-width="4" stroke-linecap="round"/>
  <circle cx="50" cy="8" r="4" fill="#4D96FF" stroke="#2B3A55" stroke-width="2"/>
  
  <circle cx="40" cy="36" r="4" fill="#2B3A55"/>
  <circle cx="60" cy="36" r="4" fill="#2B3A55"/>
  <ellipse cx="50" cy="46" rx="6" ry="3" fill="#2B3A55"/>
</svg>`,

  think: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
  <defs>
    <linearGradient id="roboGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#E2F0FF" />
      <stop offset="100%" stop-color="#B8D8FF" />
    </linearGradient>
  </defs>

  <circle cx="80" cy="20" r="10" fill="#FFF" stroke="#2B3A55" stroke-width="3"/>
  <text x="80" y="25" font-family="sans-serif" font-size="14" fill="#2B3A55" font-weight="bold" text-anchor="middle">?</text>

  <path d="M 25 60 Q 15 65, 20 80" fill="none" stroke="#2B3A55" stroke-width="4" stroke-linecap="round"/>
  <path d="M 75 60 Q 85 55, 65 50" fill="none" stroke="#2B3A55" stroke-width="4" stroke-linecap="round"/>
  
  <rect x="35" y="55" width="30" height="30" rx="8" fill="url(#roboGrad)" stroke="#2B3A55" stroke-width="4"/>
  
  <g transform="rotate(-5 50 37)">
    <rect x="25" y="20" width="50" height="35" rx="12" fill="url(#roboGrad)" stroke="#2B3A55" stroke-width="4"/>
    <line x1="50" y1="20" x2="50" y2="10" stroke="#2B3A55" stroke-width="4" stroke-linecap="round"/>
    <circle cx="50" cy="8" r="4" fill="#FFD93D" stroke="#2B3A55" stroke-width="2"/>
    <circle cx="40" cy="38" r="4" fill="#2B3A55"/>
    <circle cx="60" cy="38" r="4" fill="#2B3A55"/>
  </g>
</svg>`,

  search: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
  <defs>
    <linearGradient id="roboGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#E2F0FF" />
      <stop offset="100%" stop-color="#B8D8FF" />
    </linearGradient>
  </defs>

  <path d="M 40 38 L 10 20 A 30 30 0 0 0 10 56 Z" fill="#4ECB71" opacity="0.3"/>

  <path d="M 25 60 Q 15 70, 25 85" fill="none" stroke="#2B3A55" stroke-width="4" stroke-linecap="round"/>
  <path d="M 75 60 Q 85 70, 75 85" fill="none" stroke="#2B3A55" stroke-width="4" stroke-linecap="round"/>
  
  <rect x="35" y="55" width="30" height="30" rx="8" fill="url(#roboGrad)" stroke="#2B3A55" stroke-width="4"/>
  
  <rect x="25" y="20" width="50" height="35" rx="12" fill="url(#roboGrad)" stroke="#2B3A55" stroke-width="4"/>
  
  <line x1="50" y1="20" x2="50" y2="10" stroke="#2B3A55" stroke-width="4" stroke-linecap="round"/>
  <circle cx="50" cy="8" r="4" fill="#4ECB71" stroke="#2B3A55" stroke-width="2"/>
  
  <circle cx="60" cy="38" r="4" fill="#2B3A55"/>
  
  <circle cx="40" cy="38" r="6" fill="none" stroke="#4ECB71" stroke-width="2"/>
  <circle cx="40" cy="38" r="2" fill="#4ECB71"/>
</svg>`,

  loading: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
  <defs>
    <linearGradient id="roboGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#E2F0FF" />
      <stop offset="100%" stop-color="#B8D8FF" />
    </linearGradient>
  </defs>

  <g stroke="#2B3A55" stroke-width="2" fill="#FFD93D">
    <circle cx="85" cy="30" r="6" />
    <path d="M85 22V24 M85 36V38 M93 30H91 M77 30H79" stroke-linecap="round"/>
    <circle cx="15" cy="75" r="5" fill="#A8B2C1"/>
     <path d="M15 68V70 M15 80V82 M22 75H20 M8 75H10" stroke-linecap="round"/>
  </g>

  <path d="M 25 60 Q 15 55, 30 45" fill="none" stroke="#2B3A55" stroke-width="4" stroke-linecap="round"/>
  <path d="M 28 43 L 22 37 M 32 47 L 36 43" stroke="#2B3A55" stroke-width="4" stroke-linecap="round"/>

  <path d="M 75 60 Q 85 65, 80 80" fill="none" stroke="#2B3A55" stroke-width="4" stroke-linecap="round"/>
  
  <rect x="35" y="55" width="30" height="30" rx="8" fill="url(#roboGrad)" stroke="#2B3A55" stroke-width="4"/>
  
  <rect x="25" y="20" width="50" height="35" rx="12" fill="url(#roboGrad)" stroke="#2B3A55" stroke-width="4"/>
  
  <line x1="50" y1="20" x2="50" y2="10" stroke="#2B3A55" stroke-width="4" stroke-linecap="round"/>
  <circle cx="50" cy="8" r="4" fill="#FFD93D" stroke="#2B3A55" stroke-width="2"/>
  
  <circle cx="40" cy="38" r="4" fill="#2B3A55"/>
  <circle cx="60" cy="38" r="4" fill="#2B3A55"/>
</svg>`,

  sleep: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
  <defs>
    <linearGradient id="roboGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#E2F0FF" />
      <stop offset="100%" stop-color="#B8D8FF" />
    </linearGradient>
  </defs>

  <text x="75" y="25" font-family="sans-serif" font-size="12" fill="#2B3A55" font-weight="bold">Z</text>
  <text x="85" y="15" font-family="sans-serif" font-size="10" fill="#2B3A55" font-weight="bold">z</text>

  <path d="M 25 60 Q 15 70, 25 85" fill="none" stroke="#2B3A55" stroke-width="4" stroke-linecap="round"/>
  <path d="M 75 60 Q 85 70, 75 85" fill="none" stroke="#2B3A55" stroke-width="4" stroke-linecap="round"/>
  
  <rect x="35" y="55" width="30" height="30" rx="8" fill="url(#roboGrad)" stroke="#2B3A55" stroke-width="4"/>
  
  <rect x="25" y="25" width="50" height="35" rx="12" fill="url(#roboGrad)" stroke="#2B3A55" stroke-width="4"/>
  
  <path d="M 50 25 Q 45 15, 35 12" fill="none" stroke="#2B3A55" stroke-width="4" stroke-linecap="round"/>
  <circle cx="35" cy="12" r="4" fill="#A8B2C1" stroke="#2B3A55" stroke-width="2"/>
  
  <path d="M 35 42 Q 40 46, 45 42" fill="none" stroke="#2B3A55" stroke-width="3" stroke-linecap="round"/>
  <path d="M 55 42 Q 60 46, 65 42" fill="none" stroke="#2B3A55" stroke-width="3" stroke-linecap="round"/>
</svg>`,

  'head-palm': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
  <defs>
    <linearGradient id="roboGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#E2F0FF" />
      <stop offset="100%" stop-color="#B8D8FF" />
    </linearGradient>
  </defs>
  
  <path d="M 25 60 Q 20 40, 35 35" fill="none" stroke="#2B3A55" stroke-width="4" stroke-linecap="round"/>
  <path d="M 75 60 Q 80 70, 78 85" fill="none" stroke="#2B3A55" stroke-width="4" stroke-linecap="round"/>
  
  <rect x="35" y="55" width="30" height="30" rx="8" fill="url(#roboGrad)" stroke="#2B3A55" stroke-width="4"/>
  
  <rect x="25" y="22" width="50" height="35" rx="12" fill="url(#roboGrad)" stroke="#2B3A55" stroke-width="4"/>
  
  <path d="M 50 22 Q 55 12, 65 15" fill="none" stroke="#2B3A55" stroke-width="4" stroke-linecap="round"/>
  <circle cx="65" cy="15" r="4" fill="#A8B2C1" stroke="#2B3A55" stroke-width="2"/>
  
  <path d="M 55 40 Q 60 36, 65 40" fill="none" stroke="#2B3A55" stroke-width="3" stroke-linecap="round"/>
  
  <rect x="30" y="28" width="20" height="20" rx="8" fill="#E2F0FF" stroke="#2B3A55" stroke-width="4" transform="rotate(-10 40 38)"/>

  <line x1="55" y1="50" x2="65" y2="50" stroke="#2B3A55" stroke-width="3" stroke-linecap="round"/>
</svg>`,

  type: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
  <defs>
    <linearGradient id="roboGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#E2F0FF" />
      <stop offset="100%" stop-color="#B8D8FF" />
    </linearGradient>
  </defs>
  
  <rect x="30" y="80" width="40" height="10" rx="2" fill="#A8B2C1" stroke="#2B3A55" stroke-width="3"/>
  <line x1="35" y1="85" x2="65" y2="85" stroke="#2B3A55" stroke-width="2" stroke-dasharray="4 2"/>

  <path d="M 25 60 Q 25 75, 40 80" fill="none" stroke="#2B3A55" stroke-width="4" stroke-linecap="round"/>
  <path d="M 75 60 Q 75 75, 60 80" fill="none" stroke="#2B3A55" stroke-width="4" stroke-linecap="round"/>
  
  <rect x="35" y="55" width="30" height="30" rx="8" fill="url(#roboGrad)" stroke="#2B3A55" stroke-width="4"/>
  
  <rect x="25" y="22" width="50" height="35" rx="12" fill="url(#roboGrad)" stroke="#2B3A55" stroke-width="4"/>
  
  <line x1="50" y1="22" x2="50" y2="12" stroke="#2B3A55" stroke-width="4" stroke-linecap="round"/>
  <circle cx="50" cy="10" r="4" fill="#4D96FF" stroke="#2B3A55" stroke-width="2"/>
  
  <ellipse cx="40" cy="40" rx="4" ry="2" fill="#2B3A55"/>
  <ellipse cx="60" cy="40" rx="4" ry="2" fill="#2B3A55"/>
</svg>`,

  validation: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
  <defs>
    <linearGradient id="roboGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#E2F0FF" />
      <stop offset="100%" stop-color="#B8D8FF" />
    </linearGradient>
  </defs>
  
  <path d="M 25 60 Q 15 70, 25 85" fill="none" stroke="#2B3A55" stroke-width="4" stroke-linecap="round"/>

  <path d="M 75 60 Q 85 50, 85 35" fill="none" stroke="#2B3A55" stroke-width="4" stroke-linecap="round"/>
  <circle cx="80" cy="32" r="5" fill="#B8D8FF" stroke="#2B3A55" stroke-width="3"/>
  
  <rect x="35" y="55" width="30" height="30" rx="8" fill="url(#roboGrad)" stroke="#2B3A55" stroke-width="4"/>
  
  <rect x="25" y="20" width="50" height="35" rx="12" fill="url(#roboGrad)" stroke="#2B3A55" stroke-width="4"/>
  
  <line x1="50" y1="20" x2="50" y2="10" stroke="#2B3A55" stroke-width="4" stroke-linecap="round"/>
  <circle cx="50" cy="8" r="4" fill="#4ECB71" stroke="#2B3A55" stroke-width="2"/>
  
  <circle cx="40" cy="36" r="4" fill="#2B3A55"/>
  <path d="M 55 36 Q 60 31, 65 36" fill="none" stroke="#2B3A55" stroke-width="3" stroke-linecap="round"/>
  <path d="M 40 46 Q 50 52, 60 46" fill="none" stroke="#2B3A55" stroke-width="3" stroke-linecap="round"/>
</svg>`,
  
  validation2: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
  <defs>
    <linearGradient id="roboGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#E2F0FF" />
      <stop offset="100%" stop-color="#B8D8FF" />
    </linearGradient>
  </defs>

  <path d="M 25 60 Q 15 70, 25 85" fill="none" stroke="#2B3A55" stroke-width="4" stroke-linecap="round"/>

  <path d="M 75 60 Q 85 55, 85 45" fill="none" stroke="#2B3A55" stroke-width="4" stroke-linecap="round"/>
  <path d="M 85 45 C 80 45, 78 40, 80 35 C 82 30, 88 30, 90 35 C 92 40, 95 40, 95 48 C 95 52, 90 55, 85 52" fill="#E2F0FF" stroke="#2B3A55" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>

  
  <rect x="35" y="55" width="30" height="30" rx="8" fill="url(#roboGrad)" stroke="#2B3A55" stroke-width="4"/>
  
  <rect x="25" y="20" width="50" height="35" rx="12" fill="url(#roboGrad)" stroke="#2B3A55" stroke-width="4"/>
  
  <line x1="50" y1="20" x2="50" y2="10" stroke="#2B3A55" stroke-width="4" stroke-linecap="round"/>
  <circle cx="50" cy="8" r="4" fill="#4ECB71" stroke="#2B3A55" stroke-width="2"/>
  
  <path d="M 35 36 Q 40 42, 45 36" fill="none" stroke="#2B3A55" stroke-width="3" stroke-linecap="round"/>
  <path d="M 55 36 Q 60 42, 65 36" fill="none" stroke="#2B3A55" stroke-width="3" stroke-linecap="round"/>
</svg>`,

  base2: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
  <defs>
    <linearGradient id="roboGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#D0E3FF" />
    </linearGradient>
    
    <linearGradient id="darkGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#A8B2C1" />
      <stop offset="100%" stop-color="#7B8CA5" />
    </linearGradient>
  </defs>

  <line x1="50" y1="20" x2="50" y2="6" stroke="#2B3A55" stroke-width="4" stroke-linecap="round"/>
  <circle cx="50" cy="6" r="5" fill="#FFD93D" stroke="#2B3A55" stroke-width="3"/>

  <path d="M 32 60 Q 15 65, 18 80" fill="none" stroke="#2B3A55" stroke-width="4" stroke-linecap="round"/>
  <circle cx="18" cy="80" r="4" fill="url(#darkGrad)" stroke="#2B3A55" stroke-width="3"/>
  
  <path d="M 68 60 Q 85 65, 82 80" fill="none" stroke="#2B3A55" stroke-width="4" stroke-linecap="round"/>
  <circle cx="82" cy="80" r="4" fill="url(#darkGrad)" stroke="#2B3A55" stroke-width="3"/>

  <rect x="42" y="48" width="16" height="12" fill="url(#darkGrad)" stroke="#2B3A55" stroke-width="4"/>

  <path d="M 36 56 L 64 56 L 68 85 C 68 90, 62 94, 50 94 C 38 94, 32 90, 32 85 Z" fill="url(#roboGrad)" stroke="#2B3A55" stroke-width="4" stroke-linejoin="round"/>
  
  <rect x="42" y="66" width="16" height="8" rx="4" fill="#4D96FF" stroke="#2B3A55" stroke-width="3"/>

  <rect x="16" y="28" width="10" height="16" rx="3" fill="url(#darkGrad)" stroke="#2B3A55" stroke-width="4"/>
  <rect x="74" y="28" width="10" height="16" rx="3" fill="url(#darkGrad)" stroke="#2B3A55" stroke-width="4"/>

  <rect x="22" y="20" width="56" height="34" rx="14" fill="url(#roboGrad)" stroke="#2B3A55" stroke-width="4"/>

  <circle cx="36" cy="38" r="4" fill="#2B3A55"/>
  <circle cx="64" cy="38" r="4" fill="#2B3A55"/>
  
  <ellipse cx="28" cy="43" rx="4" ry="2" fill="#FF6B6B" opacity="0.5"/>
  <ellipse cx="72" cy="43" rx="4" ry="2" fill="#FF6B6B" opacity="0.5"/>

  <path d="M 46 44 Q 50 48, 54 44" fill="none" stroke="#2B3A55" stroke-width="3" stroke-linecap="round"/>
</svg>`,
};

export const ROBOT_IMAGES = {
  wave: svgToDataUrl(ROBOT_SVG.wave),
  base: svgToDataUrl(ROBOT_SVG.base),
  base2: svgToDataUrl(ROBOT_SVG.base2),
  success: svgToDataUrl(ROBOT_SVG.success),
  error: svgToDataUrl(ROBOT_SVG.error),
  angry: svgToDataUrl(ROBOT_SVG.angry),
  angry2: svgToDataUrl(ROBOT_SVG.angry2),
  shock: svgToDataUrl(ROBOT_SVG.shock),
  think: svgToDataUrl(ROBOT_SVG.think),
  search: svgToDataUrl(ROBOT_SVG.search),
  loading: svgToDataUrl(ROBOT_SVG.loading),
  sleep: svgToDataUrl(ROBOT_SVG.sleep),
  'head-palm': svgToDataUrl(ROBOT_SVG['head-palm']),
  type: svgToDataUrl(ROBOT_SVG.type),
  validation: svgToDataUrl(ROBOT_SVG.validation),
  validation2: svgToDataUrl(ROBOT_SVG.validation2),
} as const;
