This folder contains placeholder images used by the demo storefront.

To replace placeholders with your real product images:

- Add image files to this folder (for example `product-1.jpg`, `product-2.jpg`).
- Update the paths in `src/data/products.js` to point to the new filenames, e.g.:

  ```js
  // src/data/products.js
  {
    id: 1,
    name: 'My Product',
    image: '/images/product-1.jpg',
    images: ['/images/product-1.jpg', '/images/product-1-2.jpg']
  }
  ```

- Alternatively, replace the existing placeholder files named `product-placeholder-1.svg` and `product-placeholder-2.svg` with your images while keeping the same filenames.

Notes:
- Files placed in `public/images` are served at runtime from `/images/<filename>`.
- Prefer optimized, web-friendly formats (WebP/JPEG) and responsive variants for production.

If you'd like, I can:
- rename or add files for a one-to-one mapping (e.g. `product-1.jpg`), and
- update `src/data/products.js` to programmatically associate images by product `id`.

Happy to wire specific images you provide.
