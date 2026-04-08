# Design Brief

## Direction
Playful maximalism celebrating coin-earning rewards. Dark, energetic interface with gold and green accents. Game-like visual hierarchy with rewarding interactions.

## Tone & Purpose
Mobile-first coin-earning app for guests. Tone is celebratory and instant-gratification focused. Every interaction feels rewarding. No login friction.

## Color Palette

| Token | OKLCH | Usage |
|-------|-------|-------|
| Primary/Accent | `0.78 0.2 80` (Gold) | CTA buttons, coin elements, spin wheel, active states |
| Secondary | `0.68 0.19 140` (Green) | Success badges, achievement states, positive feedback |
| Background | `0.12 0 0` (Near-black) | Full page background, immersive dark theme |
| Card | `0.18 0 0` (Dark grey) | Elevated surfaces, feature cards |
| Foreground | `0.95 0 0` (White) | Primary text, high contrast readability |
| Muted | `0.35 0 0` (Dark grey) | Secondary text, disabled states |
| Destructive | `0.62 0.2 20` (Red) | Warnings, destructive actions |
| Border | `0.25 0 0` (Subtle dark) | Card borders, input fields |

## Typography
- **Display**: GeneralSans (geometric, bold, playful — app title, section headers)
- **Body**: Figtree (friendly, modern — content, labels, descriptions)
- **Mono**: GeistMono (technical — coin values, codes)

## Shape Language
Moderate rounded corners (`12px` default). Consistent grid. Purposeful shadows for depth hierarchy.

## Structural Zones

| Zone | Treatment |
|------|-----------|
| Header | Dark card bg with gold accent border/glow, prominent "Paisa Hi Paisa" title |
| Coin Dashboard | Centered card with large gold coin count, recent earnings list |
| Spin Wheel | Full-width card with animated wheel graphic, "70 Free Spins" label, gold glow |
| Quiz | Card with question, multiple choice, green success feedback |
| Daily Check-in | Card with streak counter, green badge, claim button |
| Withdrawal | Form card with bank details fields, gold conversion info, submit CTA |
| Footer | Grounded muted surface with branding |

## Elevation & Depth
- **Background**: Base surface, no shadow
- **Card** (`.shadow-card`): +4px drop shadow, readable contrast
- **Elevated** (`.shadow-elevated`): +8px drop shadow for CTAs and interactive overlays
- **Glow Effects**: Gold and green glows on coin elements for celebratory feel

## Component Patterns
- **CTA Buttons**: Gold background, dark text, hover glow effect
- **Achievement Badges**: Green background, white text, subtle shadow
- **Coin Display**: Gold text color with optional glow for emphasis
- **Cards**: Dark card surface with border, shadow, clear interior spacing
- **Input Fields**: Dark background, subtle border, focus ring in gold

## Motion & Animation
- **Transitions**: `all 0.3s cubic-bezier(0.4, 0, 0.2, 1)` for all interactive elements
- **Spin Wheel**: Continuous rotation animation (`spin 1s linear`)
- **Pulse Effect**: Gentle pulse on achievement badges (`pulse 2s`)
- **Bounce**: Micro-interaction on reward popups (`bounce 1s`)

## Signature Detail
Gold coin imagery and glow effects throughout. Green success badges for achievements. Dark immersive background creates contrast for bright accent colors. Game-like visual system (elevation, shadows, animations) builds reward fantasy.

## Constraints
- Mobile-first responsive design
- No gradients except subtle coin gradient utility
- High contrast for accessibility (gold on dark, green on dark exceed WCAG AA)
- Coin counts and reward values in monospace for clarity
