# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:


## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

# Luma Studio

Luma is a premium, responsive e-commerce portfolio project built around the idea of considered everyday objects. It demonstrates a complete storefront flow with mock product data, local persistence, animated interactions, product discovery, and a simulated checkout.

## Features

- Editorial home page with hero campaign, curated categories, new arrivals, limited release, personal product finder, and newsletter capture.
- Product catalog with category tabs, search, sorting, responsive filters, product cards, wishlist actions, and compare selection.
- Product detail pages with gallery, variants, size selection, quantity controls, delivery estimator, specifications, and recommendations.
- Persistent shopping bag with quantities, free shipping progress, summary, wishlist, toasts, and empty states.
- Three-step mock checkout with address, delivery, payment, validation, and animated order confirmation.
- Floating local shopping assistant that parses natural-language budget, category, color, and style requests.
- Light and dark themes, responsive mobile navigation, keyboard-friendly controls, motion transitions, and accessible labels.
- 30 generated mock products from 15 realistic product definitions, using Indian pricing in rupees.

## Tech stack

- React 19 and Vite 6
- React Router
- Framer Motion
- Lucide React icons
- CSS custom properties and responsive CSS (Tailwind-compatible Vite setup is included)
- Context-style local store hook with LocalStorage persistence

## Folder structure

```text
src/
	App.jsx       Routed application and reusable UI components
	App.css       Responsive Luma visual system
	data.js       Mock catalog, categories, and price helpers
	index.css     Global browser defaults
```

## Run locally

```bash
npm install
npm run dev
```

The project also supports `npm run build` for a production bundle and `npm run preview` to inspect that bundle locally.

## Future improvements

- Move the store into a dedicated Context provider or Redux Toolkit slice as the catalog grows.
- Add real API adapters, authentication, server-side inventory, and order history.
- Replace the local assistant matcher with a secure AI-backed recommendation service.
- Add Playwright coverage for cart, checkout, theme persistence, and responsive navigation.
- Add real visual-search embeddings and image upload storage.
