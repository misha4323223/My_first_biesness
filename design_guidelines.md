# Design Guidelines: LUMINA Premium Beauty Salon

## Design Approach

**Reference-Based** inspired by Aesop's architectural minimalism + high-end hotel spa aesthetics (Aman, Four Seasons) + luxury salon sites (Rossano Ferretti, Frédéric Fekkai). Focus: serene sophistication, professional excellence, tactile luxury.

## Typography

**Primary Font:** Playfair Display (serif) - elegant, timeless luxury
- Headlines: 5xl-6xl (48-64px), font-light, tracking-wide, leading-tight
- Service names: 3xl-4xl (36-48px), font-normal, tracking-normal
- Section headers: 4xl (40px), font-light, tracking-widest

**Body Font:** Inter (sans-serif) - professional clarity
- Body text: base-lg (16-18px), font-light, leading-relaxed, tracking-normal
- Service descriptions: base (16px), font-normal, leading-loose
- Labels/prices: sm (14px), font-medium, tracking-wide

## Spacing System

Tailwind units: **4, 6, 8, 12, 16, 20, 24, 32** - luxurious breathing room
- Sections: py-24 to py-32 (desktop), py-16 (mobile)
- Service grids: gap-8 to gap-12
- Card padding: p-8 to p-12

## Section Structure

### 1. Hero (85vh)
Full-width serene salon interior image with natural light, minimalist design aesthetic
- Centered overlay: "LUMINA" wordmark (gold accent), tagline "Where Beauty Meets Artistry"
- Blurred-background CTA: "Book Your Experience"

### 2. Philosophy Statement
Centered max-w-4xl container, refined introduction to LUMINA's approach to beauty
Gold accent divider line above and below

### 3. Signature Services (3-column grid)
lg:grid-cols-3, md:grid-cols-2 layout
Featured services: Facial Treatments, Hair Artistry, Advanced Skincare
Each card: elegant service image, service name, brief description, duration, "Learn More" link
6 featured services total

### 4. The LUMINA Experience (2-column asymmetric)
Left: Large atmospheric salon photography (60% width)
Right: Key differentiators, expert stylists, premium products, personalized consultations
Forest green accent heading

### 5. Service Categories (4-column grid)
lg:grid-cols-4, md:grid-cols-2
Categories: Face, Hair, Body, Wellness
Minimalist category imagery, category name, service count
Hover: subtle gold border glow

### 6. Expert Team (3-column grid)
Professional team portraits, stylist name, specialization, years of experience
Brief bio, "View Portfolio" link
6-9 team members

### 7. Transformations Gallery (masonry layout)
Before/after imagery in elegant presentation
2-3 column varied heights, professional photography
Subtle gold frame treatment

### 8. Client Testimonials (carousel/grid)
Client photos with testimonials, star ratings
3-column grid or horizontal scroll
8-10 testimonials

### 9. Booking Experience
Centered booking form with service selection, preferred date/time, stylist preference
Adjacent: Operating hours, location, parking info, preparation tips
Gold accent submit button

### 10. Footer
Minimal navigation, social links, location map preview, awards/certifications, newsletter signup

## Component Library

**Navigation:** Forest green header bar, LUMINA wordmark center (gold), minimal menu (Services, Team, Gallery, Contact), Book Now button right

**Buttons:**
- Primary: Deep forest green, gold text, px-12 py-4, tracking-wide, subtle shadow
- Secondary: Gold border, forest green text, hover fills gold
- Blurred backgrounds when on images: backdrop-blur-md, bg-cream/20

**Service Cards:** Soft cream background, subtle shadow, service image (16:9 ratio), service name, description, price, centered alignment

**Form Inputs:** Charcoal border, soft cream focus background, rounded-sm, px-6 py-4, placeholder in charcoal-light

**Badges:** Gold background, forest green text, "SIGNATURE" or "NEW"

## Images

**Hero:** 1 luxurious salon interior, natural light streaming through large windows, minimalist furniture, plants - 85vh full-width

**Signature Services:** 6 elegant close-up shots of treatments in progress, professional lighting, soft focus backgrounds

**Experience Section:** 1 wide atmospheric salon shot showing professional ambiance

**Category Images:** 4 refined lifestyle images showing service moments

**Team Portraits:** 6-9 professional headshots, consistent lighting and background (soft cream backdrop)

**Transformations:** 8-12 before/after professional beauty shots

**Testimonials:** 8-10 client portraits (optional, can use initials instead)

**All images:** Professional photography, soft lighting, muted luxury palette, editorial salon magazine quality

## Visual Effects

Minimal, refined animations:
- Gentle fade-in on scroll (350ms ease)
- Image subtle scale on hover (1.02x)
- Gold accent glow transitions (300ms)
- No parallax, restrained motion

**Accent Distribution:**
- Gold for CTAs, dividers, highlights, hover states
- Forest green for headers, key sections, primary buttons
- Soft cream for backgrounds, cards, alternating sections
- Charcoal for body text, secondary elements
- Clean white for breathing room, forms

## Layout Principles

1. **Architectural space:** Luxury through generous whitespace
2. **Professional precision:** Aligned grids, consistent rhythm
3. **Centered focal points:** Symmetrical elegance
4. **Editorial photography:** Images communicate quality
5. **Restrained opulence:** Gold accents used sparingly for maximum impact