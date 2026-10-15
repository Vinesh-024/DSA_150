# DESIGN SYSTEM — COZY CODE CORNER

## 1. Visual Identity
**Warm Minimalism + Cozy Lofi + Editorial Bento + Tactile Motion.**

The application creates the ambiance of a quiet, sunlit study room: calm, spatially coherent, responsive, and distraction-free.

## 2. Color Palette & Design Tokens
```css
--color-warm-linen:    #F6F3EC; /* Primary page canvas */
--color-soft-cream:    #FFFCF6; /* Card background & raised surfaces */
--color-sage:          #A8B9A0; /* Selected states, light badges */
--color-forest-green:  #526B58; /* Primary action, success, brand key */
--color-dusty-blue:    #B9C9D7; /* Secondary info, subtle highlights */
--color-muted-clay:    #C98F79; /* Warnings, errors, delicate emphasis */
--color-warm-charcoal: #252A27; /* High-contrast editorial typography */
--color-muted-gray:    #565E59; /* Secondary body copy */
--color-soft-border:   #E7E1D6; /* Crisp hairline borders */
--color-editor-bg:     #1A1E1B; /* Cozy dark code editing canvas */
```

## 3. Typography Hierarchy
- **Body & Controls**: DM Sans / Inter (12px to 14px for density, high legibility).
- **Headings & Editorial**: Merriweather / Serif display for calm, literary weight.
- **Code & Big-O**: JetBrains Mono (12px to 13px, ligatures enabled).
- **Labels**: Uppercase 10px / 11px with `tracking-wider` and `font-mono`.

## 4. Bento-Grid Layout Principles
- Maximum of 3 to 4 functional zones on the primary dashboard.
- Zero clutter: Every bento tile answers an immediate learning question:
  - "What is my immediate focus today?"
  - "Which problem is due for spaced revision?"
  - "Where do I have conceptual gaps?"
- Resizable and collapsible sidebars/drawers in the coding workspace.

## 5. Micro-Interactions & Motion System
- **Button Press**: `active:scale-[0.98]` compression with 120ms ease-out.
- **Card Hover**: Subtle hairline border color shift to `--color-sage` with 150ms transition.
- **Drawer Slide**: 220ms ease-in-out height transition for output console.
- **Reduced Motion**: Respects `prefers-reduced-motion: reduce` across all transitions.
