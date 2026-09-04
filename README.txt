# Moses & Saralea — Ruracio 2027

A mobile-first, static wedding invitation website.

## Folder structure

wedding-invitation/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── script.js
└── images/
    ├── Image1.jpg
    ├── Image2.jpg
    ├── Image3.jpg
    ├── Image4.jpg
    └── Image5.jpg

## Setup

1. Put the five real wedding photos into the `images` folder using the exact names above.
2. Open `index.html` in a browser, or deploy the entire folder to GitHub Pages / Vercel.
3. No backend or database is required.

## Important customization

The event time was not provided, so the countdown currently targets the start of 8 January 2027 in East Africa Time (+03:00).

To change it, edit this line in `js/script.js`:

const EVENT_DATE = "2027-01-08T00:00:00+03:00";

The map uses a Google Maps search/directions link based on the supplied venue name. Before publishing the final invitation, verify that Google Maps resolves the intended Oriwo National School pin.


FINAL VERSION ADDITIONS
- Fully responsive refinements for phones, tablets and computers.
- Dedicated "A little gift" section.
- One-tap copy for 0704594253 with success feedback.
- Back-to-top floating control.
- Better mobile touch targets and accessibility.
- Reduced-motion support remains enabled.
