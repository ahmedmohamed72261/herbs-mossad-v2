# Herbiva — Website (Next.js Pages Router)

Handoff README. It documents **the flow we executed**, **what is completed**, and **what is still missing**,
so another AI (or developer) can resume without re-discovering the context.

---

## 1. What this project is

A bilingual (EN/AR, RTL-aware) company website for **Herbiva** — an Egyptian exporter of premium herbs,
spices, seeds, dried flowers and botanical raw materials.

* Old brand strings: `Organic Herbs Co` / `ORGANIC HERBS` / `Herba` → **must always become `Herbiva`**.
* Data layer: `lib/api.ts` (axios) talks to a Laravel backend through `NEXT_PUBLIC_API_URL`.
* No `src/` directory. No App Router. **Pages Router only.**

### Tech stack

| Item | Value |
| --- | --- |
| Framework | Next.js **14.0.0**, Pages Router |
| React | 18.2.0 |
| Styling | Tailwind CSS v3 + `styles/globals.css` design system |
| State | Zustand 4 + `persist` (localStorage key `herbs-app-storage`) |
| Animation | `motion/react` (Framer Motion) |
| Icons | `react-icons/fi` (Feather) |
| Toasts | `react-hot-toast` |
| HTTP | axios |

### The design source (UI/UX reference)

The whole visual language was ported from a static Bootstrap template:

```
H:\Web Projects Git Hub\Laravel\organic-cattle-farm\
├── index.html      → hero, stats, why-us, categories, products, journey, promo, testimonials, blog, FAQ, contact
├── about.html      → inner-page pattern
├── project.html    → projects page layout
├── advice.html     → advice/research page layout
├── contact.html
├── shop.html       → shop grid layout
├── listing-details.html → product/shop detail layout
├── cart.html       → cart layout
├── checkout.html   → checkout layout
└── css/style.css   → source of all colors/typography/shadows/radii
```

**Decision taken (confirmed with the user): "Hybrid" approach.** We adopt the template's *layout, colors and
components*, but keep the project's own React component architecture, Tailwind utilities, i18n and API layer.
Content/images stay the project's (Herbiva photos), not the cattle-farm ones.

---

## 2. How to run (Windows notes — important)

PowerShell on this machine **blocks `npm.ps1` / `npx.ps1`** (`running scripts is disabled on this system`).
Use one of these instead:

```powershell
# Option A — call the Next CLI directly with node (works in PowerShell)
node node_modules/next/dist/bin/next dev

# Option B — use Git Bash (UCRT64)
npm run dev
```

Environment: `NEXT_PUBLIC_API_URL` (see `.env.local`). The frontend expects the Laravel API to be running
separately; when the API is down the pages fall back to hardcoded demo data.

> **Do NOT run `npm ci`.** `package-lock.json` still pins `next@16.4.2` while `package.json` says `14.0.0`.
> Running `npm ci` installs Next 16 and breaks the app. See "Still missing" §6.4.

### Route smoke-test (used throughout this work)

```powershell
foreach ($p in @('/','/about/','/products/','/projects/','/advice/','/catalog/','/certificates/','/team/','/export/','/contact/','/shop/','/cart/','/checkout/')) {
  $c = curl.exe -sL -o NUL -w "%{http_code}" "http://localhost:3000$p"; Write-Output "$p -> $c"
}
```

---

## 3. The design system (already built — use it, don't reinvent)

All of this lives in `styles/globals.css` and `tailwind.config.js`.

### Palette

| Token | Hex | Use |
| --- | --- | --- |
| Leaf green | `#A5C232` | primary brand / buttons |
| Lime | `#D1F349` | accent text on dark |
| Neon | `#CCFF00` | high-contrast CTA |
| Ink | `#0D1615` | headings, dark sections |
| Body | `#272320` | body copy |
| Muted | `#5E5E5E` | secondary copy |
| Line | `#E2E2E2` | borders |
| Cream | `#F6F4EC` | alt section bg |
| Dim | `#F8F8F8` | alt section bg |
| Gold | `#FECB0E` | star ratings |
| Sale/red | `#FF003D` | badges |

Tailwind tokens available: `leaf` (`leaf-light`, `leaf-neon`), `ink` (`ink-soft`, `ink-muted`), `line`,
`cream`, `dim`, `gold`, `sale`. Legacy `herba-*` tokens still exist but are **remapped onto this palette**
(so old markup does not break) — new code should not use them.

### Fonts

`font-display` → Anybody · `font-sans` → Manrope · `font-stat` → Kanit. Loaded in `pages/_document.tsx`.

### Component classes

* Sections: `.section-shell` (vertical padding) · `.section-dark` · `.section-lime` · `.section-dim` · `.section-cream`
* Type: `.eyebrow` · `.section-title` · `.section-lead`
* Buttons: `.btn-primary` · `.btn-neon` · `.btn-ghost` · `.btn-dark` · `.btn-white` · `.btn-sm`
* Surfaces: `.card-organic` · `.img-frame` · `.icon-badge` · `.glass-panel` · `.glass-panel-dark`
* Chips: `.tag-chip` · `.tag-sale` · `.filter-chip` · `.filter-chip-active`
* Forms: `.field-input` · `.field-area` · `.field-label`
* Misc: `.page-banner` · `.stat-number` · `.star-row` · `.skeleton-*`
* Utilities: `.animate-float-slow` · `.animate-float-delayed` · `.animate-reveal-up` · `.animate-fade-in` · `.text-gradient-leaf`

Always wrap section content in `<div className="container">`.

### Shared shell components

* `components/Layout.tsx` — `<Head>` + Navbar + `PageTransition` + Footer + FloatingWhatsApp + GoToTop. Applies `dir`/`lang`.
* `components/Navbar.tsx` — dark utility bar (address/email, certificates/catalog/team/export, AR-EN, theme) + sticky main nav with Products dropdown, **cart drawer with live badge**, mobile menu.
* `components/Footer.tsx` — contact strip + 4-column footer + newsletter + copyright. Uses `new Date().getFullYear()`.
* `components/PageBanner.tsx` — the dark image breadcrumb banner used on **every inner page**.
* `components/ProductCard.tsx` — product card with price + add-to-cart.
* `components/Motion.tsx` — `FadeIn`, `StaggerGrid`, `StaggerItem`, `PageTransition`.
* `components/Loading.tsx` — `PageLoader`.

### Cart store (`store/index.ts`)

```ts
useAppStore()      // { language, theme, cart, setLanguage, setTheme, toggleTheme,
                   //   addToCart, removeFromCart, setQuantity, clearCart }
DELIVERY_CHARGES   // 5
getCartTotals(cart, discount?)  // { itemCount, subtotal, delivery, discount, total }
formatPrice(value) // "$12.50"
```

**The cart store is finished and waiting to be consumed by the shop/cart/checkout pages (§6).**

---

## 4. The flow we executed (chronological)

1. **Origin of the task.** The session started as a Next.js *16* App-Router bug (`blocking-prerender-current-time`
   from `new Date()` in a Footer). That codebase (`src/app/...`) no longer exists — the repo was swapped to this
   Next **14** Pages-Router project, so that error class no longer applies. *(Note: `components/Footer.tsx` still
   calls `new Date().getFullYear()`; harmless on Next 14 without `cacheComponents`.)*
2. **The real request:** take the UI/UX (colors, layout, components) from
   `H:\Web Projects Git Hub\Laravel\organic-cattle-farm` and apply it to this project; rename the brand to **Herbiva**.
3. Scoped with the user: **Hybrid** design mode · **Full site incl. template-only pages** (shop, cart, checkout,
   advice, projects, listing-details) · **keep EN/AR + the existing API layer**.
4. Extracted an exhaustive design-token spec from the template's `css/style.css`.
5. Rebuilt the token layer: `tailwind.config.js`, `styles/globals.css`, `pages/_document.tsx` fonts.
6. Ported the template's decorative assets into `public/images/organic/`.
7. Rebuilt the shared shell (store → Navbar → Footer → Layout → PageBanner → ProductCard).
8. Rebuilt the home page; restyled/created the inner pages.

Support files added: `public/images/organic/` — `sub-img.png`, `white-flowr.png`, `weat.png`, `weat-bg.png`,
`body-illutions01.png`, `body-illutions02.png`, `footer-bg.webp`, `bg-donation.png`, `bg-adviced.webp`,
`banner-img01.webp`, `banner-img02.webp`, `textr.png`, `textr2.png`.
(3 template files were missing from the source and were skipped: `cherry02.png`, `bg-3.png`, `bg-1.png`.)

`public/css/style.css` is a byte-identical copy of the template stylesheet (kept for reference; the app itself
uses the Tailwind port, not this file).

---

## 5. What is COMPLETED

### Foundation — done

| File | Status |
| --- | --- |
| `tailwind.config.js` | ✅ new palette + font families + remapped `herba-*` |
| `styles/globals.css` | ✅ full design system (sections, buttons, cards, chips, forms, utilities, keyframes, dark remaps) |
| `pages/_document.tsx` | ✅ Anybody / Manrope / Kanit (+ Inter/Outfit) |
| `store/index.ts` | ✅ cart state + `DELIVERY_CHARGES` + `getCartTotals` + `formatPrice` |
| `lib/translations.ts` | ✅ added `nav.shop/cart/checkout/projects/advice`, `brand.name = 'Herbiva'`, `brand.tagline`; old brand → `Herbiva` |
| `public/images/organic/*` | ✅ 13 decorative assets ported |

### Shared components — done

| File | Status |
| --- | --- |
| `components/Layout.tsx` | ✅ rebranded title/description, `dir`/`lang`, font/bg classes |
| `components/Navbar.tsx` | ✅ rebuilt (utility bar, dropdown, cart drawer, mobile menu) |
| `components/Footer.tsx` | ✅ rebuilt to template layout, Herbiva branding |
| `components/PageBanner.tsx` | ✅ **new** dark breadcrumb banner |
| `components/ProductCard.tsx` | ✅ restyled + add-to-cart wired to store |
| `components/FloatingWhatsApp.tsx` | ✅ message rebranded |
| `components/ChatAgent.tsx` | ✅ brand strings rebranded (component is commented out in Layout) |

### Pages — done and verified HTTP 200

| Route | File | Notes |
| --- | --- | --- |
| `/` | `pages/index.tsx` | ✅ fully rebuilt: hero + video, stats, why-us, categories, featured products (API), processing journey, export CTA, testimonials, articles, FAQ, contact |
| `/about/` | `pages/about.tsx` | ✅ rebuilt on the new design system |
| `/products/` | `pages/products.tsx` | ⚠️ renders 200 but **still the OLD design** (see §6.2) |
| `/projects/` | `pages/projects.tsx` | ✅ **new page** created from `project.html` |
| `/advice/` | `pages/advice.tsx` | ✅ **new page** created from `advice.html` |
| `/catalog/` | `pages/catalog.tsx` | ✅ restyled |
| `/certificates/` | `pages/certificates.tsx` | ✅ restyled |
| `/team/` | `pages/team.tsx` | ✅ restyled |
| `/export/` | `pages/export.tsx` | ✅ restructured into alternating sections; content preserved verbatim |
| `/contact/` | `pages/contact.tsx` | ✅ restyled; form handler + API call untouched |

---

## 6. What is STILL MISSING (resume here)

### 6.1 Missing pages → currently **HTTP 404** (highest priority)

The Navbar and the home page link to these, so they are dead links right now:

* `pages/shop.tsx` — **create.** Grid of products from `api.get('/products')`, category `.filter-chip` filters,
  search, sort, pagination. Use `template/shop.html` for layout, `ProductCard` for items.
  Add-to-cart already works via `useAppStore().addToCart`.
* `pages/cart.tsx` — **create.** Line items with qty steppers (`setQuantity`), remove (`removeFromCart`),
  order summary using `getCartTotals(cart)` + `DELIVERY_CHARGES`, `formatPrice`. Use `template/cart.html`.
* `pages/checkout.tsx` — **create.** Billing/shipping form with `.field-input`, order summary, coupon field,
  place-order action (`clearCart()` + toast). Use `template/checkout.html`.
* `pages/shop/[id].tsx` — **optional.** The template's `listing-details.html`. Currently
  `pages/products/[id].tsx` already serves as the detail page; only build this if you want a separate
  shop-flavoured detail route.

> The cart store, `ProductCard` add-to-cart and the Navbar cart drawer are **already wired** — the three pages
> only need to consume them.

### 6.2 Not yet migrated off the old design

* **`pages/products.tsx`** — still uses the original dark-green/gold palette (`#0e2916`, `#2d6a4f`, `#566359`,
  `#d6a757`) and its own hero, not `PageBanner`. Rebuild it with `<PageBanner>`, `.section-shell`,
  `.filter-chip` / `.filter-chip-active`, `StaggerGrid` and `ProductCard`, matching `pages/index.tsx`
  §"FEATURED PRODUCTS" and §"CATEGORIES".
* **`pages/products/[id].tsx`** — still uses legacy `herba-*` classes throughout (grep it). Restyle to
  `.section-shell` / `.card-organic` / `.btn-primary` / `.stat-number`, keep `getStaticPaths` + `getStaticProps`
  and the icon-map logic intact. This is the "listing-details" page.
* **`components/GoToTop.tsx`** — still `from-herba-dark to-herba-green`; switch to `#0D1615` → `#A5C232`.
* **`components/ErrorBoundary.tsx`** — still `text-herba-dark` / `bg-herba-green`.
* **`components/ChatAgent.tsx`** — still many `herba-*` classes (low priority: commented out in `Layout.tsx`).

### 6.3 Brand / content leftovers

* `pages/index.tsx` references the video `src="/images/ORGANIC HERBS CO.mp4"`.
  Rename the file (e.g. `public/images/herbiva-showreel.mp4`) and update the path, or leave the path as-is —
  it is not user-visible. **Reference: `pages/index.tsx` around line 179.**
* Sweep for any remaining `Organic Herbs` / `ORGANIC HERBS` / `Herba` occurrences across `pages/` and `components/`:

  ```
  Grep pattern:  herba-|Organic Herbs|ORGANIC HERBS|Herba[^v]
  Scope:         pages/**/*.{ts,tsx}, components/**/*.{ts,tsx}
  ```
  *(Known non-issues: `translations.ts` `herbalTeas: 'Herbal Teas'` and the English tagline
  `'Organic Herbs & Spices'` are legitimate product wording, not brand names.)*

### 6.4 Environment / tooling

* **`package-lock.json` is inconsistent** — it pins `next@16.4.2` while `package.json` declares `14.0.0`.
  `node_modules` currently works (Next 14 CLI loads) but installs emit
  `Found lockfile missing swc dependencies`. Fix in **Git Bash**:
  ```bash
  npm install          # regenerates the lockfile to match package.json — safe
  # NEVER run `npm ci` first: it would install Next 16 and break the app
  ```
* PowerShell blocks `npm`/`npx` script execution → use `node node_modules/next/dist/bin/next ...` or Git Bash.

### 6.5 Not yet verified

* Production build has **not** been run. After finishing the above:
  ```powershell
  node node_modules/next/dist/bin/next build
  ```
  Expect possible static-generation errors in `pages/products/[id].tsx` (`getStaticPaths`) if the API is not
  reachable — make sure it has a fallback.
* Dark mode and RTL (`language === 'ar'`) have **not** been visually reviewed on every page.
* Mobile responsiveness of the new sections has **not** been visually reviewed.

---

## 7. Pitfalls to avoid (learned the hard way)

1. **`react-icons/fi` missing icons silently become `undefined`** → the page crashes with
   *"Element type is invalid: expected a string … but got: undefined"*.
   **`FiLeaf` does NOT exist** (nor `FiSeedling`, `FiPlant`, `FiWheat`). This exact mistake broke the home page.
   Always verify a name before importing:
   ```
   Grep pattern: FiXxx   Path: node_modules/react-icons/fi/index.d.ts
   ```
   Known-good: `FiArrowRight, FiCheckCircle, FiChevronDown, FiChevronUp, FiDroplet, FiFeather, FiGlobe,
   FiPackage, FiShield, FiStar, FiTrendingUp, FiTruck, FiAward, FiSun, FiMoon, FiMail, FiMapPin, FiPhone,
   FiSend, FiDownload, FiCalendar, FiUser, FiShoppingCart, FiTrash2, FiPlus, FiMinus, FiMenu, FiX, FiVolume2, FiVolumeX`.
2. **Do not use `"use cache"` / `cacheComponents` / App-Router APIs.** This is the Pages Router. Caching a
   component that contains event handlers (a form `onSubmit`) throws
   *"Event handlers cannot be passed to Client Component props"*. (This was the original failure mode in the
   previous Next-16 codebase.)
3. **Next 14 Pages Router + `new Date()` in render is fine.** Do not add `"use client"`/`use cache` workarounds —
   those belonged to the old Next-16 setup.
4. **All routes have a trailing-slash redirect.** Test with `curl -L` (`/about` → 308 → `/about/`).
5. **Debugging SSR "Element type is invalid"?** Read the dev-server terminal, not the browser: the console prints
   the component stack (e.g. `at Home (webpack-internal:///./pages/index.tsx:…)`).
6. **Keep i18n intact.** Every page reads `const { language } = useAppStore(); const t = translations[language];`.
   New copy must provide both EN and AR.

---

## 8. Definition of done for the remaining work

1. `/shop/`, `/cart/`, `/checkout/` return **200**, add-to-cart → cart → checkout works end-to-end (with cart
   persistence across reloads via the Zustand `persist` store).
2. `pages/products.tsx` and `pages/products/[id].tsx` use the new design system — **zero `herba-*` classes left**
   anywhere under `pages/` and `components/`.
3. `node node_modules/next/dist/bin/next build` succeeds.
4. Dark mode + Arabic RTL visually checked on all routes.
5. `npm install` run once (in Git Bash) so `package-lock.json` matches `package.json`.
