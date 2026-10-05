# Sticky Stacking Panels — Full Concept Guide (How It Actually Works)

এই ডকটা পড়ো যেন তুমি নতুন করে বুঝছো। গোল: **স্ক্রল করলে কার্ডগুলো একটার উপর একটা উঠে ঢেকে যায়** — কিন্তু এটা কোনো JS animation না।

---

## ০) আগে এক লাইনে সত্যটা ধরো

> প্রতিটা প্যানেলকে `position: sticky` দিয়ে ভিউপোর্টের এক জায়গায় আটকে রাখো।  
> পরের প্যানেলটা সাধারণ স্ক্রলে নিচ থেকে উপরে আসবে।  
> সেটার `z-index` বেশি + ব্যাকগ্রাউন্ড অপাশ্ব (solid) থাকলে আগের প্যানেলটা ঢেকে যাবে।  
> **এটাই পুরো “অ্যানিমেশন”。**

Motion / GSAP / `transform` / timeline — core effect-এর জন্য লাগে না।

---

## ১) মানুষ কী দেখে vs ব্রাউজার কী করে

### মানুষ যা দেখে
1. প্রথম কার্ড এসে থেমে যায় (pin)।
2. স্ক্রল চালিয়ে গেলে দ্বিতীয় কার্ড নিচ থেকে উঠে প্রথমটাকে ঢেকে দেয়।
3. তৃতীয় কার্ড দ্বিতীয়টাকে ঢাকে।
4. শেষ কার্ডের পর পেজ স্বাভাবিকভাবে পরের সেকশনে চলে যায়।

### ব্রাউজার যা করে (সত্য)
1. পেজটা **লম্বা** — প্যানেলগুলো একটার পর একটা document flow-তে থাকে।
2. প্রতিটা প্যানেল sticky হওয়ায় তার নিজের স্ক্রল রেঞ্জের ভিতরে `top` অফসেটে আটকে থাকে।
3. পরের প্যানেলটা DOM-এ নিচে আছে বলে স্ক্রল করলে সে উপরে উঠে আসে।
4. `z-index` বেশি বলে সে উপরে **পেইন্ট** হয়।
5. Solid background থাকলে নিচের কার্ড দেখা যায় না → মনে হয় “কভার অ্যানিমেশন”。

অর্থাৎ: **দেখতে animation, আসলে layout + paint order.**

---

## ২) Sticky আসলে কী? (সবচেয়ে গুরুত্বপূর্ণ অংশ)

`position: sticky` মানে:

1. শুরুতে element সাধারণ `relative`-এর মতো চলে (নরমাল ফ্লোতে জায়গা নেয়)।
2. স্ক্রল করতে করতে যখন element-এর উপরের অংশ `top: X` লাইনে পৌঁছায়, তখন সে **ভিউপোর্টে আটকে যায়**।
3. কিন্তু sticky চিরকাল থাকে না।  
   Sticky শুধু ততক্ষণ কাজ করে, যতক্ষণ তার **containing block / parent scroll range**-এ জায়গা থাকে।
4. Parent-এর শেষ হয়ে গেলে sticky “ছেড়ে দেয়” এবং element আবার উপরের দিকে চলে যায় (unstick)।

### একটা প্যানেলের জীবনচক্র

ধরো Panel 1:

```
[A] Panel এখনো নিচে .......... দেখা যাচ্ছে, উপরে উঠছে
[B] Panel-এর টপ === sticky top .. এখন PIN / আটকে গেল
[C] User আরও স্ক্রল করছে ...... Panel 1 আটকেই আছে
[D] Panel 2 উপরে উঠে আসছে .... Panel 2 ঢেকে দিচ্ছে (z-index বেশি)
[E] Stack শেষ / parent শেষ .... sticky ছেড়ে দেয়, সেকশন চলে যায়
```

**মনে রাখো:** Panel 1 নিজে move করে না যখন sticky থাকে।  
**পরে আসা Panel 2** উপরে উঠে এসে ঢাকে।

---

## ৩) DOM স্ট্রাকচার কেমন হতেই হবে

এটা না মিললে “proper হবে না”।

### ✅ সঠিক স্ট্রাকচার

```html
<section class="services">           <!-- section wrapper -->
  <header class="intro">...</header> <!-- optional, NOT sticky -->

  <div class="stack">                <!-- stack container -->
    <article class="panel">1</article>
    <article class="panel">2</article>
    <article class="panel">3</article>
  </div>
</section>

<section class="next-section">...</section>
```

প্যানেলগুলো **siblings** (ভাইবোন) হতে হবে — একই parent-এর ভিতরে একটার পর একটা।

### ❌ ভুল স্ট্রাকচার (এতে sticky ভাঙে / overlap হয় না)

```html
<!-- ভুল 1: প্রতিটা প্যানেল আলাদা tall wrapper-এ -->
<div class="panel-wrap" style="height:300vh">
  <article class="panel sticky">1</article>
</div>
<div class="panel-wrap" style="height:300vh">
  <article class="panel sticky">2</article>
</div>

<!-- ভুল 2: overflow hidden parent -->
<div style="overflow: hidden">
  <article class="panel sticky">...</article>
</div>

<!-- ভুল 3: absolute stack (এটা অন্য প্যাটার্ন) -->
<div class="relative h-screen">
  <article class="absolute inset-0">1</article>
  <article class="absolute inset-0">2</article>
</div>
```

**নিয়ম:**  
Stack container-এর ভিতরে panels = normal document flow siblings + `position: sticky`.

---

## ৪) স্ক্রলের সময় ফ্রেম-বাই-ফ্রেম কী হয়

ধরো ৩টা প্যানেল। প্রতিটার উচ্চতা প্রায় এক ভিউপোর্ট।

### Frame 1 — শুধু Panel 1 দেখা যাচ্ছে
```
======= VIEWPORT =======
|  HEADER              |
|  PANEL 1 (sticky soon)|
|                      |
========================
       PANEL 2 (নিচে, এখনো বাইরে)
       PANEL 3
```

### Frame 2 — Panel 1 পিন হলো
```
======= VIEWPORT =======
|  HEADER              |
|  PANEL 1 ★ STUCK     |
|                      |
========================
       PANEL 2 উঠছে...
```

### Frame 3 — Panel 2 অর্ধেক ঢাকছে
```
======= VIEWPORT =======
|  HEADER              |
|  PANEL 2 (উপরে আসছে) |  z-index: 2
|  (নিচে Panel 1 আটকে) |  z-index: 1  ← ঢাকা পড়ছে
========================
```

এখানেই “অ্যানিমেশন” মনে হয়। আসলে Panel 2 নরমাল স্ক্রলে উপরে উঠছে।

### Frame 4 — Panel 2 ফুল কভার + নিজে পিন
```
======= VIEWPORT =======
|  HEADER              |
|  PANEL 2 ★ STUCK     |
|                      |
========================
       PANEL 3 উঠছে...
```

### Frame 5 — Panel 3 একইভাবে কভার করে
একই লজিক।

---

## ৫) তিনটা জিনিস একসাথে না থাকলে কাজ করবে না

### (A) `position: sticky` + সঠিক `top`

```css
.panel {
  position: sticky;
  top: 80px; /* বা তোমার navbar উচ্চতা */
}
```

`top` মানে: ভিউপোর্টের উপর থেকে কত নিচে আটকাবে।  
Navbar থাকলে navbar-এর নিচে রাখো। নাহলে কার্ড navbar-এর তলায় ঢুকে যাবে।

উদাহরণ:
- Fixed header height ≈ `64px` → `top: 64px` বা `4rem`
- Floating pill + safe area →  
  `top: max(5.25rem, calc(env(safe-area-inset-top, 0px) + 4.5rem))`

### (B) বাড়তে থাকা `z-index`

```css
.panel:nth-child(1) { z-index: 1; }
.panel:nth-child(2) { z-index: 2; }
.panel:nth-child(3) { z-index: 3; }
```

বা JS/React-এ: `zIndex: index + 1`

কেন লাগে?
- Sticky শুধু position আটকায়।
- কে উপরে দেখাবে সেটা `z-index` / paint order ঠিক করে।
- `z-index` সমান হলে পরের প্যানেল সবসময় সুন্দরভাবে ঢাকবে না; কখনো আংশিক “মিলেমিশে” দেখাবে।

### (C) Opaque (solid) background

```css
.panel {
  background: #0f0f0f; /* বা #fff / যেকোনো solid color */
}
```

Transparent panel হলে নিচের কার্ড দেখা যাবে → “cover” নষ্ট।  
শুধু text থাকলেও panel wrapper-এ solid bg দিতে হবে।

---

## ৬) উচ্চতা (height) কেন এত গুরুত্বপূর্ণ

Sticky stack-এর feel নির্ভর করে প্রতিটা প্যানেল কত লম্বা তার উপর।

### Ideal
প্রতিটা প্যানেল প্রায় পুরো দেখা যায় এমন উচ্চতা:

```css
min-height: calc(100dvh - var(--sticky-top));
```

মানে: স্ক্রিনের পুরো উচ্চতা − sticky top offset।

### কী হয় যদি height কম হয়?
- পরের কার্ড খুব তাড়াতাড়ি চলে আসে
- আগের কার্ড পুরোপুরি “slide” হিসেবে পিন হয়ে টিকতে পারে না
- overlap অদ্ভুত লাগে

### কী হয় যদি height খুব বেশি হয়?
- প্রতি কার্ডে অনেকক্ষণ স্ক্রল করতে হয়
- এক ভিউপোর্টে কন্টেন্ট ছোট মনে হয়

### Last panel
শেষ প্যানেলে প্রায়ই:
```css
.panel:last-child {
  min-height: auto;      /* content অনুযায়ী */
  margin-bottom: 0;
}
```
যাতে পরের সেকশনে মসৃণভাবে বেরোনো যায়।

---

## ৭) Negative margin কী করে? (optional polish)

Desktop-এ আমরা ব্যবহার করি:

```css
.panel:not(:last-child) {
  margin-bottom: -12dvh;
}
```

### কেন?
নরমাল ফ্লোতে Panel 2, Panel 1-এর **ঠিক পরে** শুরু হয়।  
Negative margin Panel 2-কে একটু **উপরে টেনে আনে**, তাই কভার আগে শুরু হয় — বেশি cinematic।

### এটা কি বাধ্যতামূলক?
না। Core effect sticky + z-index + bg দিয়েই হয়।  
Negative margin শুধু timing/feel বাড়ায়।

### Mobile
প্রথমে ছাড়াই টেস্ট করো। দরকার হলে ছোট value (`-6dvh`) দাও।

---

## ৮) পুরো কাজের সিকোয়েন্স (ইমপ্লিমেন্ট অর্ডার)

এই অর্ডারে করো — এলোমেলো করলে ডিবাগ কঠিন।

### Step 1 — শুধু HTML siblings বানাও
কোনো sticky ছাড়াই ৩টা বড় ব্লক রাখো। স্ক্রল করে দেখো তারা একটার পর একটা আসে কিনা।

### Step 2 — প্রত্যেকটাতে solid background + min-height দাও
যাতে প্রত্যেকটা প্রায় full screen দেখায়।

### Step 3 — `position: sticky` + `top` লাগাও
স্ক্রল করো: প্রথমটা আটকায় কিনা দেখো।

### Step 4 — `z-index` বাড়াও
এখন দেখবে পরেরটা আগেরটার উপরে উঠে ঢাকছে।

### Step 5 — (optional) negative margin
কভার একটু আগে শুরু করতে চাইলে।

### Step 6 — পরের সেকশনের bg + z-index ঠিক করো
যাতে stack শেষে পরের সেকশন পরিষ্কারভাবে উপরে আসে।

---

## ৯) Complete working example (plain HTML)

এই ফাইলটা সেভ করে ব্রাউজারে খুলে স্ক্রল করো। ফ্রেমওয়ার্ক লাগবে না।

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Sticky Stack Demo</title>
  <style>
    :root {
      --sticky-top: 72px;
      --panel-h: calc(100dvh - var(--sticky-top));
    }

    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: system-ui, sans-serif;
      background: #111;
      color: #fff;
    }

    /* Fake fixed header */
    .header {
      position: fixed;
      inset: 0 0 auto 0;
      height: var(--sticky-top);
      display: flex;
      align-items: center;
      padding: 0 20px;
      background: #000;
      border-bottom: 1px solid #333;
      z-index: 100;
    }

    .intro {
      padding: calc(var(--sticky-top) + 40px) 20px 40px;
      max-width: 720px;
    }

    .stack {
      position: relative;
    }

    .panel {
      position: sticky;
      top: var(--sticky-top);
      isolation: isolate;
      min-height: var(--panel-h);
      padding: 40px 20px;
      /* desktop polish */
      margin-bottom: -12dvh;
    }

    .panel:last-child {
      margin-bottom: 0;
      min-height: auto;
      padding-bottom: 80px;
    }

    .panel h2 { margin: 0 0 12px; font-size: 28px; }
    .panel p { margin: 0; max-width: 60ch; line-height: 1.6; opacity: 0.9; }

    .p1 { background: #1a1a1a; z-index: 1; }
    .p2 { background: #243018; z-index: 2; }
    .p3 { background: #182433; z-index: 3; }

    .next {
      min-height: 100vh;
      padding: 80px 20px;
      background: #0a0a0a;
      position: relative;
      z-index: 10; /* important: sit above leftover stack */
    }
  </style>
</head>
<body>
  <div class="header">Demo Header</div>

  <section>
    <div class="intro">
      <h1>WHAT I DO</h1>
      <p>Intro scrolls away normally. Then panels pin and cover each other.</p>
    </div>

    <div class="stack">
      <article class="panel p1">
        <h2>01. First panel</h2>
        <p>I stick under the header. Keep scrolling — the next panel will cover me.</p>
      </article>

      <article class="panel p2">
        <h2>02. Second panel</h2>
        <p>I have higher z-index + solid background, so I hide panel 1 while scrolling up.</p>
      </article>

      <article class="panel p3">
        <h2>03. Third panel</h2>
        <p>Same idea. After me, the next section should take over cleanly.</p>
      </article>
    </div>
  </section>

  <section class="next">
    <h2>Next section</h2>
    <p>If this appears cleanly, your stack exit is correct.</p>
  </section>
</body>
</html>
```

**প্রথমে এই ডেমো কাজ করিয়ে নাও।**  
এটা কাজ করলে কনসেপ্ট ঠিক। এরপর তোমার প্রজেক্টের layout-এ একই লজিক পোর্ট করো।

---

## ১০) React-এ পোর্ট করার সময় ঠিক কী ম্যাপ করবে

| Concept | React/Tailwind |
|--------|-----------------|
| sticky | `className="sticky"` |
| top | `style={{ top: STICKY_TOP }}` বা `top-[...]` |
| z-index | `style={{ zIndex: index + 1 }}` |
| solid bg | `bg-bg` / `bg-neutral-950` / যেকোনো opaque token |
| min-height | `minHeight: PANEL_MIN_HEIGHT` |
| negative margin | `-mb-[12dvh]` (last ছাড়া) |
| stacking context | `isolate` |
| next section above | next section-এ `relative isolate z-10` |

### React snippet (core only)

```tsx
const STICKY_TOP =
  "max(5.25rem, calc(env(safe-area-inset-top, 0px) + 4.5rem))";

const PANEL_MIN_HEIGHT =
  "calc(100dvh - max(5.25rem, calc(env(safe-area-inset-top, 0px) + 4.5rem)))";

export function StickyStack({ items }: { items: { id: string; title: string; body: string }[] }) {
  return (
    <section className="relative isolate">
      <div className="relative">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <article
              key={item.id}
              className={[
                "sticky isolate",
                // MUST be opaque
                index % 3 === 0 ? "bg-neutral-950" : index % 3 === 1 ? "bg-neutral-900" : "bg-zinc-900",
                !isLast ? "-mb-[12dvh]" : "",
              ].join(" ")}
              style={{
                top: STICKY_TOP,
                zIndex: index + 1,
                minHeight: isLast ? "auto" : PANEL_MIN_HEIGHT,
              }}
            >
              <div className="mx-auto max-w-5xl px-6 py-16">
                <h3 className="text-2xl text-white">
                  {String(index + 1).padStart(2, "0")}. {item.title}
                </h3>
                <p className="mt-4 max-w-2xl text-white/80">{item.body}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
```

---

## ১১) “Proper হচ্ছে না” — ডিবাগ চেকলিস্ট

যে অর্ডারে চেক করবে:

### 1) Sticky একেবারে কাজ করছে না
কারণ প্রায়ই:
- কোনো ancestor-এ `overflow: hidden / auto / scroll`
- Parent-এর height নেই / scroll হচ্ছে অন্য element-এ (inner scroller)
- `position: sticky` লাগেনি, বা `top` দেওয়া নেই

টেস্ট:
```css
/* temporary */
* { outline: 1px solid red; }
```
আর DevTools-এ sticky element সিলেক্ট করে Computed → `position` দেখো।

### 2) Sticky আছে, কিন্তু cover হচ্ছে না
কারণ:
- background transparent
- z-index বাড়েনি / সব এক
- panels siblings না

টেস্ট: প্রত্যেক panel-এ আলাদা solid color দাও (`red`, `green`, `blue`)।  
স্ক্রলে রং ঢাকা দেখা গেলে মেকানিক ঠিক।

### 3) Cover হচ্ছে, কিন্তু gap দিয়ে নিচের কার্ড দেখা যাচ্ছে
কারণ:
- panel height কম
- background পুরো panel ঢাকে না (শুধু inner card-এ bg)
- border-radius + gap layout

ফিক্স: **panel article নিজে** opaque bg নাও; শুধু ভিতরের card-এ নয়।

### 4) Navbar-এর নিচে কন্টেন্ট ঢেকে যাচ্ছে
`top` বাড়াও = header height + একটু gap।

### 5) শেষে পরের সেকশন প্যানেলের নিচে আটকে যাচ্ছে
পরের সেকশনে:
```css
position: relative;
z-index: 10;
background: <opaque>;
isolation: isolate;
```

### 6) Lenis / smooth scroll থাকলে অদ্ভুত
- Lenis যেন **document/body** স্ক্রল করে
- Sticky panels-এর ancestor-এ custom overflow scroller দিও না
- প্রথমে Lenis বন্ধ করে native scroll-এ টেস্ট করো; কাজ করলে Lenis আবার চালু করো

### 7) CSS modules / Tailwind conflict
কোনো global CSS যেন `.panel { position: relative !important; }` বা overflow reset করে না ফেলে।

---

## ১২) কী কী করবে না (সাধারণ ভুল)

1. **GSAP pin দিয়ে একই জিনিস আবার বানানো** — দরকার নেই; conflict করতে পারে।
2. **প্রতি প্যানেলে IntersectionObserver দিয়ে show/hide** — এটা অন্য UX।
3. **`position: fixed` দিয়ে stack করা** — sticky নয়; scroll range হিসাব নিজে করতে হয়।
4. **Absolute children + parent height 300vh hack** — সম্ভব, কিন্তু এই গাইডের প্যাটার্ন না।
5. **শুধু inner card-এ sticky** — পুরো slide surface-এ sticky লাগে।
6. **Transparent gradient-only panel bg** — নিচের কার্ড ফাঁস হয়ে যায়।

---

## ১৩) এই পোর্টফোলিওতে ঠিক কী আছে (রেফারেন্স)

ফাইল: `src/components/landing/WhatCanIDoSection.tsx`

| বিষয় | ভ্যালু / আচরণ |
|------|----------------|
| Effect | CSS sticky stacking |
| JS animation lib | নেই (core-এ) |
| Sticky top | header-এর নিচে (`max(5.25rem, ...)`) |
| Panel height | `100dvh - sticky top` |
| z-index | `index + 1` |
| Desktop overlap | `-mb-[12dvh]` (last বাদে) |
| Surfaces | `bg-bg` / `bg-surface` / `bg-card` (opaque tokens) |
| Section stacking | `#services` → `z-[1]`, `#projects` → `z-10` |

---

## ১৪) তোমার অন্য প্রজেক্টে সফল পোর্টের সংজ্ঞা

এগুলো সব True হলেই “proper” হয়েছে:

- [ ] Intro নরমাল স্ক্রলে উঠে যায়
- [ ] Panel 1 header-এর নিচে পিন হয়
- [ ] Panel 2 স্ক্রল করে Panel 1 পুরো ঢাকে (gap দিয়ে নিচেরটা দেখা যায় না)
- [ ] Panel 3 একইভাবে Panel 2 ঢাকে
- [ ] শেষ প্যানেলের পর পরের সেকশন পরিষ্কারভাবে আসে
- [ ] Mobile-এও sticky ভাঙে না
- [ ] Ancestor `overflow` sticky ভাঙে না

---

## ১৫) এক লাইনে মনে রাখার ফর্মুলা

```text
siblings in normal flow
+ position: sticky
+ top = header clearance
+ min-height ≈ viewport under header
+ z-index = 1,2,3...
+ opaque background on each panel
(+ optional -margin for earlier cover)
= sticky stacking “animation”
```

---

## ১৬) যদি এখনও না হয়

অন্য প্রজেক্টে আটকে গেলে এই ৪টা জিনিস পাঠাও/চেক করো:

1. Panel HTML structure (parent + children)
2. Computed CSS of one panel (`position`, `top`, `z-index`, `background`, `overflow` of ancestors)
3. Header fixed/sticky কিনা + তার height
4. Page scroll করছে `document`, না কোনো inner `div`

বেশিরভাগ ফেইল এই চারেই ধরা যায়।
