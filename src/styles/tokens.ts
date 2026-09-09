export const TOKENS = {
  brand: {
    name: 'ÉLVARA',
    tagline: 'TIME, REFINED.',
    origin: 'Geneva, Switzerland',
    positioning: 'Haute Horlogerie Suisse',
  },
  colors: {
    bg: '#0B0B0A',
    bgElevated: '#11110F',
    surface: '#171714',
    surfaceGlass: 'rgba(23, 23, 20, 0.65)',
    textPrimary: '#F2EEE5',
    textSecondary: '#B8B2A7',
    textMuted: '#77736B',
    border: 'rgba(242, 238, 229, 0.08)',
    borderSubtle: 'rgba(242, 238, 229, 0.04)',
    borderAccent: 'rgba(200, 180, 138, 0.25)',
    accent: '#C8B48A',
    accentMuted: '#8D7C59',
  },
  fonts: {
    display: '"Cormorant Garamond", "Georgia", serif',
    body: '"Inter", system-ui, -apple-system, sans-serif',
  },
  layout: {
    maxWidth: '1440px',
    narrowWidth: '800px',
    desktopGutter: '3rem',
    tabletGutter: '2rem',
    mobileGutter: '1.25rem',
  },
  radii: {
    none: '0px',
    subtle: '2px',
    card: '4px',
    pill: '9999px',
  },
} as const;
