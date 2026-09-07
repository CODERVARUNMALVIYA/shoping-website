const image = (url) => `${url}${url.includes('?') ? '&' : '?'}auto=format&fit=crop&w=900&q=85`

const catalog = [
  ['Aero Knit Runner', 'NOVA', 'Footwear', 3299, 4499, 4.8, 124, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff', 'Lightweight engineered knit with a cloud-soft sole.', ['Black', 'Stone'], ['6', '7', '8', '9', '10'], ['Breathable knit', 'Memory foam insole', 'Rubber outsole'], 18, ['running', 'casual', 'black']],
  ['Sora Leather Loafer', 'MORROW', 'Footwear', 4890, 6990, 4.7, 88, 'https://images.unsplash.com/photo-1533867617858-e7b97e060509', 'Polished leather loafers for modern workdays.', ['Espresso', 'Black'], ['6', '7', '8', '9', '10'], ['Full-grain leather', 'Cushioned footbed', 'Hand-finished'], 12, ['formal', 'leather', 'work']],
  ['Axis Trail Sneaker', 'TERRA', 'Footwear', 3799, 5299, 4.6, 57, 'https://images.unsplash.com/photo-1552346154-21d32810aba3', 'Adventure-ready traction in an everyday silhouette.', ['Sage', 'Cloud'], ['7', '8', '9', '10', '11'], ['Ripstop upper', 'Trail grip', 'Recycled lining'], 24, ['outdoor', 'sport', 'green']],
  ['Mira City Sandal', 'MORROW', 'Footwear', 2199, 2999, 4.5, 42, 'https://images.unsplash.com/photo-1562273138-f46be4ebdf33', 'Sculpted straps and a walk-all-day cushioned footbed.', ['Tan', 'Black'], ['5', '6', '7', '8', '9'], ['Vegan leather', 'Contour footbed', 'EVA sole'], 31, ['summer', 'casual', 'tan']],
  ['Form Overshirt', 'NOVA', 'Apparel', 2890, 3990, 4.7, 73, 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273', 'A relaxed overshirt cut from brushed organic cotton.', ['Olive', 'Black'], ['S', 'M', 'L', 'XL'], ['Organic cotton', 'Two-way zip', 'Relaxed fit'], 16, ['casual', 'layering', 'green']],
  ['Studio Pleat Trouser', 'ATELIER 9', 'Apparel', 3190, 4490, 4.6, 61, 'https://images.unsplash.com/photo-1506629905607-d9b1b3bba2c5', 'Fluid pleated trousers with a clean, tailored drape.', ['Charcoal', 'Cream'], ['28', '30', '32', '34', '36'], ['Stretch twill', 'Pleated front', 'Tapered leg'], 20, ['formal', 'tailored', 'minimal']],
  ['Ridge Utility Jacket', 'TERRA', 'Apparel', 5590, 7990, 4.8, 39, 'https://images.unsplash.com/photo-1551028719-00167b16eac5', 'A weather-ready layer with considered utility pockets.', ['Black', 'Sand'], ['S', 'M', 'L', 'XL'], ['Water resistant', 'Recycled nylon', 'YKK hardware'], 9, ['outdoor', 'jacket', 'black']],
  ['Lumen Ribbed Tank', 'ATELIER 9', 'Apparel', 1290, 1790, 4.4, 105, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab', 'A soft, sculpted essential made for warm city days.', ['White', 'Moss', 'Black'], ['XS', 'S', 'M', 'L'], ['Cotton rib', 'Slim fit', 'Pre-shrunk'], 38, ['summer', 'essential', 'white']],
  ['Arc Compact Tote', 'MORROW', 'Accessories', 3490, 4990, 4.8, 92, 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa', 'Structured carryall with room for the daily essentials.', ['Cognac', 'Black'], ['One size'], ['Faux leather', 'Laptop sleeve', 'Magnetic closure'], 14, ['bag', 'work', 'leather']],
  ['Studio Mini Crossbody', 'NOVA', 'Accessories', 2390, 3290, 4.5, 68, 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7', 'A compact crossbody for hands-free city exploring.', ['Black', 'Pistachio'], ['One size'], ['Vegan leather', 'Adjustable strap', 'Zip pocket'], 21, ['bag', 'travel', 'green']],
  ['Orbit Field Watch', 'TERRA', 'Accessories', 6990, 8990, 4.9, 47, 'https://images.unsplash.com/photo-1524805444758-089113d48a6d', 'A precise everyday watch with a brushed steel case.', ['Steel', 'Black'], ['One size'], ['Japanese movement', 'Sapphire crystal', '5 ATM water resistant'], 7, ['watch', 'gift', 'black']],
  ['Cove Sunglasses', 'ATELIER 9', 'Accessories', 1890, 2490, 4.3, 128, 'https://images.unsplash.com/photo-1511499767150-a48a237f0083', 'Angular acetate frames with full-spectrum UV protection.', ['Tortoise', 'Black'], ['One size'], ['Acetate frame', 'UV400 lenses', 'Microfibre case'], 26, ['summer', 'accessories', 'black']],
  ['Mica Ceramic Set', 'MORROW', 'Home', 2490, 3290, 4.7, 34, 'https://images.unsplash.com/photo-1493106819501-66d381c466f1', 'Four hand-glazed cups for slow mornings and long tables.', ['Chalk', 'Moss'], ['Set of 4'], ['Stoneware', 'Hand glazed', 'Dishwasher safe'], 11, ['home', 'gift', 'green']],
  ['Halo Table Light', 'NOVA', 'Home', 4290, 5990, 4.8, 51, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c', 'Ambient rechargeable light with a warm, dimmable glow.', ['Sand', 'Black'], ['One size'], ['Rechargeable', 'Dimmable', 'USB-C'], 8, ['home', 'lighting', 'minimal']],
  ['Forma Throw', 'TERRA', 'Home', 2990, 3990, 4.5, 29, 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2', 'Textured cotton throw to soften any quiet corner.', ['Terracotta', 'Oat'], ['130 x 170 cm'], ['Cotton blend', 'Woven texture', 'Machine washable'], 19, ['home', 'textile', 'orange']],
]

export const products = Array.from({ length: 2 }).flatMap((_, batch) => catalog.map((item, index) => {
  const [name, brand, category, price, originalPrice, rating, reviews, imageUrl, description, colors, sizes, specifications, stock, tags] = item
  const productId = batch * catalog.length + index + 1
  return { id: productId, name: batch ? `${name} / ${batch === 1 ? 'Edition 02' : ''}`.replace(' / ', ' ') : name, brand, category, price: batch ? price + (index % 3) * 300 : price, originalPrice, discount: Math.round((1 - price / originalPrice) * 100), rating, reviews, image: image(imageUrl), images: [image(imageUrl), image(imageUrl + '?ixlib=rb-4.1.0'), image(imageUrl + '?w=1000')], description, colors, sizes, specifications, stock: productId === 12 || productId === 27 ? 0 : batch ? stock - 2 : stock, tags, isNew: productId < 10, isBestSeller: rating > 4.7, popularity: reviews + rating * 20 }
}))

export const categories = [
  { name: 'Apparel', label: 'Everyday layers', image: products[4].image, accent: 'sage' },
  { name: 'Footwear', label: 'Walk further', image: products[0].image, accent: 'coral' },
  { name: 'Accessories', label: 'The finishing touch', image: products[8].image, accent: 'lavender' },
  { name: 'Home', label: 'Quiet objects', image: products[12].image, accent: 'sand' },
]

export const formatPrice = (value) => `₹${value.toLocaleString('en-IN')}`
