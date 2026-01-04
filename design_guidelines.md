# Design Guidelines: Premium Travel Agency Website

## Design Approach

**Reference-Based** inspired by Airbnb's spatial design + luxury hotel websites (Four Seasons, Ritz-Carlton) + modern travel platforms (Luxury Escapes). Focus: immersive visual storytelling with sophisticated, restrained elegance.

## Typography

**Primary Font:** Playfair Display (serif) for headlines - luxury, editorial feel
- Hero headlines: 5xl-6xl (72-96px), font-bold, leading-tight
- Section headers: 3xl-4xl (48-60px), font-semibold
- Featured destinations: 2xl-3xl (32-48px), font-bold

**Body Font:** Inter (sans-serif) for readability
- Body text: base-lg (16-18px), font-normal, leading-relaxed
- Captions/labels: sm (14px), font-medium
- Buttons: base (16px), font-semibold, tracking-wide

## Spacing System

Tailwind units: **4, 6, 8, 12, 16, 20, 24, 32** for luxurious breathing room.
- Sections: py-24 to py-32 (desktop), py-16 to py-20 (mobile)
- Cards/containers: p-8 to p-12
- Element gaps: gap-6, gap-8, gap-12

## Section Structure

### 1. Hero (80vh)
Full-width luxury destination imagery with gradient overlay (deep ocean blue 40% opacity)
- Centered headline: "Discover Your Next Extraordinary Journey"
- Subheadline + Quick Search Bar (destination, dates, guests)
- Blurred-background CTA button: "Explore Destinations"
- Subtle parallax scroll on image

### 2. Featured Destinations (3-column grid)
- lg:grid-cols-3, md:grid-cols-2, mobile: grid-cols-1
- Large destination cards with high-quality imagery
- Each card: destination name, starting price, "View Details" CTA
- Hover: subtle image zoom (1.05x), gold border glow
- 6-9 destinations total

### 3. Personalized Trip Planner (2-column split)
- Left: Interactive multi-step form (Travel Style, Budget, Duration, Interests)
- Right: Dynamic preview showing recommended destinations based on selections
- Progress indicator at top
- Gold accent progress bar
- "Generate Custom Itinerary" CTA

### 4. Experience Categories (4-column grid)
- lg:grid-cols-4, md:grid-cols-2
- Categories: Adventure, Relaxation, Culture, Luxury
- Icon + category name + brief description
- Cards with subtle gradient overlays, gold accent on hover

### 5. Why Choose Us (asymmetric 2-column)
- Left: Larger column with compelling copy + statistics (destinations, satisfied travelers, years)
- Right: Stacked benefit cards with icons
- Gold-accented numbers for stats

### 6. Testimonials (carousel/slider)
- Large testimonial cards (3 visible on desktop)
- Client photo, quote, name, destination traveled
- Navigation dots with gold active state
- Subtle auto-rotate

### 7. Exclusive Deals (masonry grid)
- Varied card sizes showcasing limited-time offers
- Countdown timers, discount badges (gold)
- High-impact imagery
- Mix of 2-3 column layouts

### 8. Newsletter + Contact (split section)
- Left: Newsletter signup with elegant form
- Right: Contact options (phone, email, office hours)
- Gold accent divider
- Footer below with navigation, social links, trust badges

## Component Library

**Navigation:** Sticky header, white background with subtle shadow on scroll, logo left, main nav center, "Book Now" CTA right (gold outline)

**Buttons:** 
- Primary: Ocean blue background, white text, px-8 py-3, rounded-full
- Secondary: Gold border, ocean blue text, hover fills gold
- Overlay (Hero): Blurred white/light background, dark text, subtle shadow

**Cards:** rounded-xl, overflow-hidden for images, white background, shadow-lg, subtle transform on hover

**Form Inputs:** Clean white background, rounded-lg, border (light gray), focus: ocean blue border, px-4 py-3

**Search Bar:** Large rounded-full container, white background, shadow-xl, segmented inputs (destination | dates | guests), gold search button

**Badges/Pills:** Gold background, white text, rounded-full, px-3 py-1, uppercase text

## Visual Effects

**Subtle animations only:**
- Smooth fade-in on scroll (300ms)
- Image parallax in hero (0.5x scroll speed)
- Card hover transforms (scale 1.02, shadow increase)
- No distracting particle effects or excessive motion

**Gold Accents:**
- Borders on featured elements
- CTA button outlines
- Progress indicators
- Active states
- Badge backgrounds

## Images

**Critical: Use high-quality, professional travel photography throughout**

**Hero Section:** Stunning luxury destination (e.g., Maldives overwater villa, Santorini sunset, Alpine resort) - full-width, 80vh height

**Featured Destinations:** 6-9 high-resolution images (beaches, mountains, cities, resorts) - each 800x600px minimum, landscape orientation

**Experience Categories:** 4 lifestyle images representing each category

**Testimonials:** Client portrait photos (circular crop)

**Exclusive Deals:** 4-6 varied destination imagery for offer cards

**All images:** Professional quality, vibrant colors, aspirational compositions that evoke luxury and wanderlust

## Layout Principles

1. **Generous whitespace:** Don't crowd - let imagery breathe
2. **Image-first:** Photography drives the experience
3. **Hierarchical depth:** Layer information with cards and overlays
4. **Strategic multi-column:** Use grids for galleries, single column for storytelling
5. **Mobile responsiveness:** Stack columns gracefully, maintain image impact
6. **Gold as accent only:** 5-10% of visual elements, not dominant
7. **Clean, sophisticated:** Luxury through restraint, not excess