/**
 * Merci demo — catalogue extension (used by scripts/demo/merci.js)
 *
 * The v1 store only has 27 products, so most collection pages never paginate. These products
 * are added next to the v1 catalogue under NEW handles (v1 products are never touched) and reuse
 * the photos already on merci-demo's CDN (allowed for the demo store — design/IMAGE-CREDITS.md).
 * Each product gets a coherent colour set: every colour value points at the photo of that colour.
 */
const CDN = 'https://cdn.shopify.com/s/files/1/0083/1658/4007/products/';

// photo key → file on the merci-demo CDN (duplicate uploads of the same photo are kept apart so
// the same packshot is never both image 1 and image 2 of one product)
const PHOTOS = {
  'tee-orange-model': '14_34d94d92-6de1-4343-863d-961fb839b167.jpg',
  'tee-orange-model-2': '14_ac9dcf0e-bf4a-4e84-a2e0-5cf8d241e1bb.jpg',
  'blazer-mint-front': '2_aa9528c4-81bf-4572-9d2e-122f08064860.jpg',
  'blazer-mint-back': '3_53ea1d24-3cbf-48f7-9521-a3191b3173a7.jpg',
  'blazer-mint-side': '3_4738c2d7-adfe-48ce-a4a7-6837c72697d9.jpg',
  'blazer-mint-side-2': '2_4308837b-a971-42d7-aa50-b0438d2e24fe.jpg',
  'tote-jacquard': '4_d9973a8c-d4c1-43f0-a5f4-9f1ec46663a9.jpg',
  'tote-jacquard-2': '4_a9b347df-8555-4ed8-993c-a66914a0f4f9.jpg',
  'jacket-black-model': '5_591783fc-515c-46cc-b316-181b7ccb6a5a.jpg',
  'trench-camel': '6_676b6691-ab30-4f02-bb3d-d5908f19095c.jpg',
  'shirt-coral': '7_3b532368-6ca7-43eb-9139-68ad40aeed2f.jpg',
  'sneaker-model': '8_fd620a25-51de-4b26-8a75-417dea034853.jpg',
  'suit-green': '22_61fe1abb-06d3-4df5-804e-95858840eb45.jpg',
  'jeans-mom': '1_5b949bde-b02a-457d-9382-e098ef22ee47.jpg',
  'jeans-mom-2': '1_d4f33711-b499-475e-be97-a46f8321bfff.jpg',
  'sandal-heel': '11_6a966881-1e14-4b3b-9a7e-c2c6983875bc.jpg',
  'sandal-heel-2': '11.jpg',
  'trouser-cream': '16_53cae00d-8340-485b-950f-97d42a9a11d1.jpg',
  'trouser-blue': '19_bb884074-f146-4a91-ae6a-b5f200dc039a.jpg',
  'dress-red': '9.jpg',
  'blazer-black': '10.jpg',
  'scarf-blue': '12_ecb9b6d8-78c9-4329-b00f-7849cec7533e.jpg',
  'bag-phone': '13_10704714-76a9-42b3-8b62-498d57cdca32.jpg',
  'dress-print': '15.jpg',
  'dress-crochet': '8.png',
  'dress-shirt-blue': '1_5dceb3b4-9b6d-4d05-bbcd-9015dc7d1131.png',
  'top-denim-halter': '3.png',
  'hat-boater': '17_8b6f4169-d780-4391-989d-2460e12d9292.png',
  'hat-boater-2': '17_e3da8542-535b-4b7e-b15e-c4659a3b9d3b.png',
  'hat-fedora': '25_7f66b99e-3130-42c7-9f39-dec7820a1e4c.png',
  'hat-fedora-2': '25_e8cd9c64-3fe6-46b2-bbb5-6d7cc560d236.png',
  'slide-woven': '29a.png',
  'slide-woven-2': '29.png',
  'mule-camel': '28_dc05794c-0424-4fe7-89fc-e714d1a37b52.png',
  'mule-camel-2': '28.png',
  'shorts-denim': '26_a882ab5a-cd73-4b37-a1a3-78f2040a5bdc.png',
  'shorts-denim-2': '26_cb454070-8ad4-436e-8dd7-a5498574b258.png',
  'shorts-denim-3': '26.png',
  'jacket-denim-mid': '2_daa7fe3e-de1e-4dd2-a8ea-a41db2ced10d.png',
  'jacket-denim-light': '10_faec2bab-3209-4749-b8d3-626d4f59d715.png',
  'jacket-denim-crop': '2.png',
  'lip-fuchsia': '4c.png',
  'lip-red': '4a_881965df-1aa8-44d0-83ce-e224fa15d0c9.png',
  'lip-espresso': '4b.png',
  'lip-plum': '4e.png',
  'lip-cherry': '4a.png',
  'lip-nude': '4.png',
  'lip-espresso-2': '4b_62a3762c-485e-4403-8fbb-b421a1f19c3f.png',
  'lip-fuchsia-2': '4c_f2fead59-7937-4153-bd8a-84ae64dce43b.png',
  'lip-red-2': '4d.png',
  'lip-plum-2': '4e_5ddfff8f-6cbf-4886-9b3b-30a14ef242fd.png',
  'sneaker-beige': '22.png',
  'sneaker-beige-2': '22_0227edf3-917a-47e6-b048-f9989177e176.png',
  'boot-chelsea': '6_b6f72cc2-b470-4df7-856b-db142cd2d86a.png',
  'boot-chelsea-2': '6.png',
  'skirt-black': '12_2797091f-3050-4283-85df-e31e500ec7b1.png',
  'skirt-black-2': '12_9c0e506c-ba26-401b-9e1d-b3607ca17448.png',
  'skirt-mustard': '13_9470c535-1348-4567-a44b-4ce4c8b9b553.png',
  'skirt-mustard-2': '13.png',
  'tank-black-rib': '14b_8a587a63-6cb3-478f-a107-3f5ca401c3c8.png',
  'knit-oat': '14_60faf394-95f6-4cba-bb45-a7f29c92d584.png',
  'knit-mustard': '14a_148658ae-b3ab-466e-953f-2874f43e2c92.png',
  'knit-black': '14b_68181ef2-ec01-4376-bcfa-190bd0205aa8.png',
  'knit-oat-2': '14.png',
  'knit-mustard-2': '14a.png',
  'knit-black-2': '14b.png',
  'beanie-brown': '27a.png',
  'beanie-black': '27_6f24a833-3dab-4ba2-adf9-982bb9a47e51.png',
  'bag-pompom': '11_ad5f11af-8ea0-4ed7-bbc7-2690044840e7.png',
  'bucket-green': '16_c863fe46-d0c5-4625-b3d9-c91c0fea3bd9.png',
  'bucket-denim': '20_d2de5423-59ca-4e76-bcbe-0599fa8c6b14.png',
  'tote-stripe': '19_b27adb31-8495-4de5-b974-088264d1b863.png',
  'tote-stripe-2': '19.png',
  'tote-canvas': '21_98ab5b02-3e09-477d-83b1-034e03d10a96.png',
  'tote-canvas-2': '21.png',
  'bag-quilted': '15.png',
  'bag-quilted-2': '15_c3f6b0be-373e-436d-88f0-6dcaa8bcc38a.png',
  'bag-hobo': '24_fad67a3c-528f-4cf6-aa39-bcbb6bc39e08.png',
  'bag-hobo-2': '24.png',
  'shirt-green': '9_371e9b2e-d043-425f-a294-36890971b94f.png',
  'shirt-green-2': '9_595917e9-29ac-46d6-8e47-f305ad347def.png',
  'tee-blue': '5_8d88a7f6-919b-43b5-b5d9-39ecb8665504.png',
  'tee-blue-2': '5.png',
  'tee-peach': '5a_cc638cfb-bdda-4d08-8cde-ab1576aae9b3.png',
  'tee-peach-2': '5a.png',
};
const images = Object.fromEntries(Object.entries(PHOTOS).map(([k, f]) => [`cat-${k}`, { url: CDN + f }]));

// v1 collection handles (titles are what shoppers see — see C in merci.js)
const ACC = 'cornershops';
const SHOES = 'merci-1';
const TOPS = 'clothings'; // "Hoodies & Sweatshirts" — v1 uses it as the general clothing list
const SHIRTS = 'clearance';
const JEANS = 'jewelry';
const JACKETS = 'new-in';
const KNIT = 'lorem-ipsum-dolor';
const SWIM = 'lorem-ipsum-dolor-1';
const BEAUTY = 'lorem-ipsum-dolor-2';
const LOUNGE = 'lorem-ipsum-dolor-4';
const NEW = 'new-arrival';
const TREND = 'trending';

const CLOTHING = ['XS', 'S', 'M', 'L', 'XL'];
const DENIM = ['24', '26', '28', '30', '32'];
const SHOE = ['36', '37', '38', '39', '40'];

// [colour name, photo key]
const c = (...pairs) => pairs.map(([name, key]) => ({ name, image: `cat-${key}` }));
const x = (...keys) => keys.map((k) => `cat-${k}`);

const BODY = {
  Hats: ['Made to finish an outfit and keep its shape season after season.', ['One size, adjustable inner band', 'Packs flat for travel', 'Spot clean only']],
  Bags: ['Roomy enough for a laptop, a book and everything in between.', ['Inner zip pocket', 'Reinforced handles', 'Wipe clean']],
  Scarves: ['A lightweight square you can wear four ways — neck, hair, bag or wrist.', ['90 × 90 cm', 'Hand-rolled edges', 'Dry clean']],
  Shoes: ['Cushioned insole and a flexible sole made for long days on your feet.', ['True to size', 'Leather lining', 'Non-slip rubber outsole']],
  Jeans: ['Rigid cotton denim that softens and moulds to you with every wear.', ['High rise', '100% organic cotton', 'Machine wash cold, inside out']],
  Jackets: ['A layering piece that works over a tee in spring and a knit in autumn.', ['Relaxed fit — size down for a closer fit', 'Fully lined', 'Dry clean recommended']],
  Shirts: ['An easy shirt in breathable fabric — tuck it in or wear it loose.', ['Relaxed fit', 'Mother-of-pearl buttons', 'Machine wash 30°C']],
  Tees: ['Soft, slightly slubbed cotton that keeps its shape wash after wash.', ['Regular fit', '100% cotton jersey', 'Machine wash 30°C']],
  Knitwear: ['Fine rib knit with a close, flattering fit and a soft hand feel.', ['Fitted', 'Cotton blend', 'Hand wash cold, dry flat']],
  Dresses: ['Easy to throw on, hard to take off — our favourite piece of the season.', ['Relaxed fit', 'Midi length', 'Machine wash 30°C']],
  Skirts: ['Fluid fabric that moves beautifully, with a comfortable elastic waist.', ['Elastic waistband', 'Midi length', 'Machine wash 30°C']],
  Trousers: ['Pull-on trousers with a relaxed leg that work from desk to weekend.', ['Drawstring waist', 'Side pockets', 'Machine wash 30°C']],
  Lipstick: ['Rich colour in a single swipe with a comfortable, non-drying finish.', ['3.5 g', 'Vegan & cruelty free', 'Enriched with shea butter']],
};
const body = (type, title) => {
  const [lead, facts] = BODY[type];
  return `<p>The ${title.toLowerCase()} — ${lead.charAt(0).toLowerCase()}${lead.slice(1)}</p><ul>${facts.map((f) => `<li>${f}</li>`).join('')}</ul>`;
};

// title, type, price, compare|null, colours, sizes, extra images, collections, badge
const P = (title, type, price, compare, colors, sizes, extraImages, collections, badge) => ({ title, type, price, compare, colors, sizes, extraImages, collections, badge });
const rows = [
  // Hats & scarves
  P('Wool Rib Beanie', 'Hats', 29, null, c(['Brown', 'beanie-brown'], ['Black', 'beanie-black']), [], [], [ACC, TREND]),
  P('Chunky Knit Beanie', 'Hats', 32, 39, c(['Black', 'beanie-black'], ['Brown', 'beanie-brown']), [], [], [ACC]),
  P('Cotton Twill Bucket Hat', 'Hats', 35, null, c(['Green', 'bucket-green'], ['Denim', 'bucket-denim']), [], [], [ACC, SWIM]),
  P('Washed Denim Bucket Hat', 'Hats', 38, null, c(['Denim', 'bucket-denim'], ['Green', 'bucket-green']), [], [], [ACC, NEW], 'new'),
  P('Pom-Pom Straw Circle Bag', 'Bags', 45, null, c(['Natural', 'bag-pompom']), [], [], [ACC, SWIM, TREND], 'hot'),
  P('Wide Brim Straw Boater', 'Hats', 49, null, c(['Natural', 'hat-boater-2']), [], x('hat-fedora'), [ACC, SWIM]),
  P('Straw Fedora with Ribbon', 'Hats', 52, 65, c(['Natural', 'hat-fedora-2']), [], x('hat-boater-2'), [ACC, SWIM]),
  P('Classic Panama Hat', 'Hats', 58, null, c(['Natural', 'hat-fedora']), [], x('hat-boater'), [ACC, SWIM, NEW], 'new'),
  P('Paisley Silk Bandana', 'Scarves', 25, null, c(['Cobalt', 'scarf-blue']), [], [], [ACC, NEW], 'new'),
  // Bags
  P('Striped Straw Tote', 'Bags', 59, null, c(['Multi Stripe', 'tote-stripe'], ['Natural', 'tote-canvas']), [], [], [ACC, SWIM], 'bestseller'),
  P('Canvas Shopper Tote', 'Bags', 39, null, c(['Natural', 'tote-canvas-2'], ['Multi Stripe', 'tote-stripe-2']), [], [], [ACC, SHOES]),
  P('Jacquard Weave Tote', 'Bags', 69, null, c(['Sand', 'tote-jacquard']), [], x('tote-jacquard-2'), [ACC, SHOES, TREND], 'hot'),
  P('Quilted Puffer Tote', 'Bags', 89, 110, c(['Black', 'bag-quilted']), [], x('bag-quilted-2'), [ACC, SHOES]),
  P('Leather Hobo Shoulder Bag', 'Bags', 120, null, c(['Black', 'bag-hobo']), [], x('bag-hobo-2'), [ACC, SHOES, TREND], 'bestseller'),
  P('Mini Phone Crossbody', 'Bags', 35, null, c(['Tangerine', 'bag-phone']), [], [], [ACC, NEW], 'new'),
  P('Woven Beach Bag', 'Bags', 49, 59, c(['Multi Stripe', 'tote-stripe-2']), [], x('tote-canvas'), [SWIM, ACC]),
  P('Structured Mini Hobo', 'Bags', 95, null, c(['Black', 'bag-hobo-2']), [], x('bag-quilted'), [ACC, SHOES]),
  // Shoes
  P('Chunky Leather Trainers', 'Shoes', 95, null, c(['Stone', 'sneaker-beige']), SHOE, x('sneaker-model'), [SHOES, TREND], 'bestseller'),
  P('Retro Runner Sneakers', 'Shoes', 89, 109, c(['Stone', 'sneaker-model']), SHOE, x('sneaker-beige-2'), [SHOES, NEW]),
  P('Suede Platform Trainers', 'Shoes', 99, null, c(['Stone', 'sneaker-beige-2']), SHOE, x('sneaker-model'), [SHOES]),
  P('Leather Chelsea Boots', 'Shoes', 149, 179, c(['Black', 'boot-chelsea']), SHOE, x('boot-chelsea-2'), [SHOES, ACC]),
  P('Pull-On Ankle Boots', 'Shoes', 135, null, c(['Black', 'boot-chelsea-2']), SHOE, [], [SHOES, NEW], 'new'),
  P('Block Heel Cross Mules', 'Shoes', 79, null, c(['Sand', 'sandal-heel']), SHOE, [], [SHOES, NEW], 'new'),
  P('Cross-Strap Heeled Sandals', 'Shoes', 85, null, c(['Sand', 'sandal-heel-2']), SHOE, [], [SHOES, TREND], 'hot'),
  P('Braided Slide Sandals', 'Shoes', 55, null, c(['Taupe', 'slide-woven']), SHOE, x('slide-woven-2'), [SHOES, SWIM]),
  P('Padded Strap Slides', 'Shoes', 49, 59, c(['Taupe', 'slide-woven-2']), SHOE, [], [SHOES, SWIM]),
  P('Square Toe Leather Mules', 'Shoes', 65, null, c(['Camel', 'mule-camel']), SHOE, x('mule-camel-2'), [SHOES]),
  P('Low Block Slide', 'Shoes', 45, null, c(['Camel', 'mule-camel-2']), SHOE, [], [SHOES, SWIM]),
  // Denim
  P('High Rise Denim Shorts', 'Jeans', 45, null, c(['Mid Blue', 'shorts-denim']), DENIM, [], [JEANS, SWIM], 'bestseller'),
  P('Distressed Cut-Off Shorts', 'Jeans', 42, 52, c(['Mid Blue', 'shorts-denim-2']), DENIM, [], [JEANS]),
  P('Relaxed Mom Shorts', 'Jeans', 39, null, c(['Mid Blue', 'shorts-denim-3']), DENIM, [], [JEANS, NEW], 'new'),
  P('Mom Fit High Waist Jeans', 'Jeans', 69, null, c(['Light Wash', 'jeans-mom']), DENIM, x('jeans-mom-2'), [JEANS, TREND], 'hot'),
  P('Straight Leg Vintage Jeans', 'Jeans', 75, 89, c(['Light Wash', 'jeans-mom-2']), DENIM, [], [JEANS]),
  P('Oversized Denim Jacket', 'Jackets', 98, null, c(['Mid Blue', 'jacket-denim-mid'], ['Light Wash', 'jacket-denim-light']), CLOTHING, [], [JEANS, JACKETS]),
  P('Vintage Wash Trucker Jacket', 'Jackets', 105, null, c(['Light Wash', 'jacket-denim-light'], ['Mid Blue', 'jacket-denim-mid']), CLOTHING, [], [JACKETS, JEANS]),
  P('Cropped Denim Jacket', 'Jackets', 89, 110, c(['Mid Blue', 'jacket-denim-crop']), CLOTHING, [], [JACKETS, JEANS, NEW]),
  P('Floral Jacquard Denim Top', 'Tees', 39, null, c(['Blue', 'top-denim-halter']), CLOTHING, [], [JEANS, SHIRTS, SWIM]),
  // Jackets & coats
  P('Oversized Linen Blazer', 'Jackets', 129, null, c(['Mint', 'blazer-mint-front']), CLOTHING, x('blazer-mint-back'), [JACKETS, TREND], 'bestseller'),
  P('Single-Breasted Blazer', 'Jackets', 119, 149, c(['Mint', 'blazer-mint-side']), CLOTHING, x('blazer-mint-side-2'), [JACKETS, NEW]),
  P('Belted Trench Coat', 'Jackets', 189, null, c(['Camel', 'trench-camel']), CLOTHING, [], [JACKETS, TREND], 'hot'),
  P('Relaxed Wool-Blend Blazer', 'Jackets', 139, null, c(['Black', 'blazer-black']), CLOTHING, [], [JACKETS]),
  P('Boxy Black Denim Jacket', 'Jackets', 99, null, c(['Black', 'jacket-black-model']), CLOTHING, [], [JACKETS, JEANS]),
  // Shirts, tees, knitwear
  P('Linen Resort Shirt', 'Shirts', 59, null, c(['Coral', 'shirt-coral']), CLOTHING, [], [SHIRTS, TREND], 'hot'),
  P('Short Sleeve Poplin Shirt', 'Shirts', 45, 55, c(['Green', 'shirt-green']), CLOTHING, [], [SHIRTS, TOPS]),
  P('Camp Collar Shirt', 'Shirts', 49, null, c(['Green', 'shirt-green-2']), CLOTHING, x('tee-blue'), [SHIRTS]),
  P('Cotton Poplin Shirt Dress', 'Dresses', 65, null, c(['Sky Blue', 'dress-shirt-blue']), CLOTHING, [], [SHIRTS, LOUNGE]),
  P('Cropped Boxy Tee', 'Tees', 29, null, c(['Tangerine', 'tee-orange-model']), CLOTHING, [], [TOPS, SHIRTS, NEW], 'new'),
  P('Slub V-Neck Tee', 'Tees', 22, null, c(['Sky Blue', 'tee-blue'], ['Peach', 'tee-peach']), CLOTHING, [], [TOPS, SHIRTS, LOUNGE], 'bestseller'),
  P('Relaxed Cotton Tee', 'Tees', 24, 30, c(['Peach', 'tee-peach-2'], ['Sky Blue', 'tee-blue-2']), CLOTHING, [], [TOPS, LOUNGE]),
  P('Everyday Crew Tee', 'Tees', 19, null, c(['Sky Blue', 'tee-blue-2'], ['Peach', 'tee-peach']), CLOTHING, [], [TOPS, LOUNGE]),
  P('Ribbed Crop Tank', 'Knitwear', 19, null, c(['Black', 'tank-black-rib']), CLOTHING, [], [TOPS, SHIRTS, LOUNGE]),
  P('Ribbed Knit Tank', 'Knitwear', 35, null, c(['Mustard', 'knit-mustard'], ['Oat', 'knit-oat'], ['Black', 'knit-black']), CLOTHING, [], [KNIT, SHIRTS], 'bestseller'),
  P('Cropped Knit Vest', 'Knitwear', 39, null, c(['Oat', 'knit-oat-2'], ['Mustard', 'knit-mustard-2'], ['Black', 'knit-black-2']), CLOTHING, [], [KNIT, TOPS]),
  P('Fine Knit Shell Top', 'Knitwear', 32, 42, c(['Black', 'knit-black'], ['Oat', 'knit-oat'], ['Mustard', 'knit-mustard']), CLOTHING, [], [KNIT, TOPS, TREND]),
  P('Sleeveless Rib Sweater', 'Knitwear', 45, null, c(['Mustard', 'knit-mustard-2'], ['Black', 'knit-black-2']), CLOTHING, [], [KNIT, NEW], 'new'),
  P('Cotton Knit Crop Top', 'Knitwear', 29, null, c(['Oat', 'knit-oat'], ['Black', 'knit-black-2']), CLOTHING, [], [KNIT, SHIRTS, LOUNGE]),
  P('Merino Blend Knit Tank', 'Knitwear', 55, 69, c(['Black', 'knit-black-2'], ['Mustard', 'knit-mustard']), CLOTHING, [], [KNIT]),
  P('Crochet Mini Dress', 'Dresses', 79, null, c(['Tangerine', 'dress-crochet']), CLOTHING, [], [KNIT, SWIM, NEW], 'new'),
  // Dresses & skirts
  P('Puff Sleeve Midi Dress', 'Dresses', 89, 109, c(['Poppy Red', 'dress-red']), CLOTHING, [], [NEW, TREND]),
  P('Printed Wrap Dress', 'Dresses', 95, null, c(['Ivory Floral', 'dress-print']), CLOTHING, [], [NEW, TOPS], 'new'),
  P('Cropped Tee & Mini Skirt Set', 'Dresses', 69, null, c(['Tangerine', 'tee-orange-model-2']), CLOTHING, [], [NEW, TREND, SWIM]),
  P('Pleated Midi Skirt', 'Skirts', 55, null, c(['Black', 'skirt-black'], ['Mustard', 'skirt-mustard']), CLOTHING, [], [TOPS, NEW]),
  P('Crinkle Maxi Skirt', 'Skirts', 59, 69, c(['Mustard', 'skirt-mustard-2'], ['Black', 'skirt-black-2']), CLOTHING, [], [TOPS, LOUNGE]),
  P('Satin Slip Midi Skirt', 'Skirts', 49, null, c(['Black', 'skirt-black-2']), CLOTHING, [], [TOPS, LOUNGE]),
  // Loungewear
  P('Pull-On Linen Trousers', 'Trousers', 55, null, c(['Cream', 'trouser-cream']), CLOTHING, [], [LOUNGE, TOPS]),
  P('Drawstring Cotton Trousers', 'Trousers', 49, null, c(['Cornflower', 'trouser-blue']), CLOTHING, [], [LOUNGE, TOPS], 'bestseller'),
  P('Linen Co-ord Trousers', 'Trousers', 79, null, c(['Green', 'suit-green']), CLOTHING, [], [LOUNGE, NEW], 'new'),
  P('Lounge Shirt Dress', 'Dresses', 59, 75, c(['Sky Blue', 'dress-shirt-blue']), CLOTHING, x('trouser-blue'), [LOUNGE]),
  // Beauty
  P('Velvet Matte Lipstick', 'Lipstick', 24, null, c(['Classic Red', 'lip-red'], ['Fuchsia', 'lip-fuchsia'], ['Plum', 'lip-plum'], ['Espresso', 'lip-espresso'], ['Nude', 'lip-nude']), [], [], [BEAUTY, TREND], 'bestseller'),
  P('Satin Cream Lipstick', 'Lipstick', 22, null, c(['Fuchsia', 'lip-fuchsia-2'], ['Cherry', 'lip-cherry'], ['Plum', 'lip-plum-2']), [], [], [BEAUTY]),
  P('Longwear Lip Colour', 'Lipstick', 26, null, c(['Plum', 'lip-plum-2'], ['Nude', 'lip-nude']), [], [], [BEAUTY, NEW], 'new'),
  P('Tinted Lip Balm', 'Lipstick', 18, null, c(['Nude', 'lip-nude']), [], [], [BEAUTY]),
  P('Bold Cherry Lipstick', 'Lipstick', 22, 28, c(['Cherry', 'lip-cherry']), [], [], [BEAUTY]),
  P('Espresso Matte Lipstick', 'Lipstick', 24, null, c(['Espresso', 'lip-espresso-2'], ['Plum', 'lip-plum']), [], [], [BEAUTY]),
  P('Berry Stain Lipstick', 'Lipstick', 24, null, c(['Plum', 'lip-plum'], ['Fuchsia', 'lip-fuchsia']), [], [], [BEAUTY, TREND]),
  P('Signature Red Lipstick', 'Lipstick', 26, 32, c(['Classic Red', 'lip-red-2'], ['Cherry', 'lip-cherry']), [], [], [BEAUTY], 'hot'),
  P('Hydra Shine Lipstick', 'Lipstick', 20, null, c(['Fuchsia', 'lip-fuchsia'], ['Nude', 'lip-nude']), [], [], [BEAUTY]),
  P('Lipstick Discovery Trio', 'Lipstick', 49, 66, c(['Classic Red', 'lip-red'], ['Espresso', 'lip-espresso-2'], ['Fuchsia', 'lip-fuchsia-2']), [], [], [BEAUTY, NEW]),
];

const slug = (s) => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const products = rows.map((r, i) => {
  const p = {
    handle: slug(r.title),
    title: r.title,
    vendor: 'Merci Demo',
    type: r.type,
    price: r.price,
    body: body(r.type, r.title),
    colors: r.colors,
    sizes: r.sizes,
    extraImages: r.extraImages,
    collections: r.collections,
    // deterministic "social proof" so re-running the generator gives the same data
    rating: [4 + ((i * 3) % 10) / 10, 6 + ((i * 17) % 90)],
    sold: 8 + ((i * 29) % 140),
  };
  if (r.compare) p.compare = r.compare;
  if (r.badge) p.badge = r.badge;
  else if (r.compare) p.badge = 'sale';
  return p;
});

module.exports = { images, products };
