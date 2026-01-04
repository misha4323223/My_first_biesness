# Design Guidelines: NATURA Premium Cosmetics

## Design Approach

**Reference-Based** inspired by Aesop's minimalist sophistication + Glossier's clean aesthetic + luxury skincare sites (La Mer, Augustinus Bader). Focus: refined simplicity, tactile elegance, editorial product presentation.

## Typography

**Primary Font:** Cormorant Garamond (serif) - elegant, refined luxury
- Headlines: 4xl-5xl (56-72px), font-light, tracking-wider, leading-tight
- Product names: 2xl-3xl (32-48px), font-normal, tracking-wide
- Section headers: 3xl (36px), font-light, tracking-widest

**Body Font:** Inter (sans-serif) - clean readability
- Body text: base (16px), font-light, leading-relaxed, tracking-wide
- Product descriptions: sm-base (14-16px), font-normal, leading-loose
- Labels/prices: xs-sm (12-14px), font-medium, uppercase, tracking-widest

## Spacing System

Tailwind units: **4, 6, 8, 12, 16, 24, 32** - emphasizing generous breathing room.
- Sections: py-24 to py-32 (desktop), py-16 (mobile)
- Product grids: gap-8 to gap-12
- Card padding: p-8 to p-12

## Section Structure

### 1. Hero (90vh)
Full-width lifestyle image (serene bathroom scene with NATURA products, soft natural light)
- Off-center minimal text: "NATURA" wordmark + tagline "Pure. Intentional. Transformative."
- Single blurred-background CTA: "Discover Collection"

### 2. Philosophy Statement (centered, full-width)
- max-w-3xl container, centered text
- Elegant copy about brand values and ingredients
- Soft muted rose divider line

### 3. Featured Products (3-column grid)
- lg:grid-cols-3, md:grid-cols-2, single on mobile
- Clean product photography on soft beige backgrounds
- Product name, key ingredient, price, "Add to Cart" text link
- 6-9 featured items

### 4. Ingredient Spotlight (2-column asymmetric)
- Left: Large botanical/ingredient photography (60% width)
- Right: Ingredient story, benefits, featured products using it
- Muted rose accent heading

### 5. Product Categories (4-column grid)
- lg:grid-cols-4, md:grid-cols-2
- Categories: Cleanse, Treat, Hydrate, Protect
- Minimal category image, category name, product count
- Subtle hover state (slight opacity change)

### 6. The NATURA Ritual (stepped layout)
- 3-step skincare routine visualization
- Each step: number (large, charcoal), product image, description
- Vertical progression with connecting soft lines

### 7. Social Proof (masonry/card layout)
- Before/after imagery, customer testimonials with photos
- User-generated content aesthetic
- 2-3 column varied heights

### 8. Bestsellers Carousel
- Horizontal scroll, 4-5 products visible
- Larger product cards with ratings
- "Shop All Bestsellers" CTA

### 9. Newsletter + Values (split section)
- Left: Newsletter signup with refined form
- Right: Brand commitments (cruelty-free, sustainable, dermatologist-tested icons)
- Footer: minimal navigation, social links, payment badges

## Component Library

**Navigation:** Clean white background, NATURA wordmark center, minimal menu left (Shop, About, Journal), icons right (Search, Account, Cart)

**Buttons:**
- Primary: Deep charcoal background, white text, px-10 py-3, rounded-full, tracking-wide
- Secondary: Muted rose border, charcoal text, hover fills rose
- Text Links: Uppercase, tracking-widest, underline on hover

**Product Cards:** No borders, white background, minimal shadow, clean product image (square ratio), name, price stacked below, centered alignment

**Form Inputs:** Soft beige background, no border, rounded-md, px-4 py-3, placeholder in charcoal-light, focus: subtle charcoal border

**Badges:** Muted rose or soft beige background, charcoal text, rounded-full, px-3 py-1, "NEW" or "BESTSELLER"

## Images

**Hero:** Spa-like bathroom scene with NATURA products, natural light, soft shadows - 90vh full-width

**Featured Products:** 6-9 clean product shots on soft beige backgrounds, consistent lighting, minimal styling

**Ingredient Spotlight:** 1 large botanical/nature macro photography (flower, plant, water droplet)

**Category Images:** 4 lifestyle images (hands applying product, close-ups of textures)

**Ritual Section:** 3 product flatlay images

**Social Proof:** 4-6 customer lifestyle photos, authentic aesthetic

**All images:** Professional, soft lighting, muted tones matching color palette, editorial quality

## Visual Effects

**Minimal animations:**
- Subtle fade-in on scroll (400ms ease)
- Product image gentle scale on hover (1.03x)
- Smooth cart icon bounce on add
- No parallax, no excessive motion

**Accent Usage:**
- Muted rose for section dividers, badges, hover states
- Soft beige for backgrounds, alternating sections
- Deep charcoal for all text, primary buttons
- Clean white for cards, forms, spacious breathing room

## Layout Principles

1. **Abundant whitespace:** Luxury through space, not density
2. **Editorial composition:** Photography as hero, text supports
3. **Centered alignment:** Symmetrical balance, refined restraint
4. **Soft grid systems:** Asymmetric where elegant, structured where needed
5. **Tactile minimalism:** Subtle textures, sophisticated simplicity