// Static blog content. No CMS/DB — edit this file to add or update posts.
// Each post renders a card on /blog and a full article at /blog/:slug.

export const blogPosts = [
  {
    slug: 'building-a-capsule-wardrobe',
    title: 'Building a Capsule Wardrobe That Actually Works',
    excerpt: 'Fewer, better pieces beat a closet full of impulse buys. Here is how to build a wardrobe you actually reach for every morning.',
    author: 'Mina Adel',
    date: '2026-06-18',
    readMinutes: 6,
    tag: 'Style',
    cover: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
    body: [
      'A capsule wardrobe is a small, curated collection of clothes that mix and match effortlessly. The goal is not minimalism for its own sake — it is removing the daily friction of deciding what to wear.',
      'Start with a neutral base: a few well-cut tees, one great denim jacket, a pair of tailored chinos, and shoes that go with everything. From there, add two or three accent pieces that reflect your taste.',
      'Quality matters more than quantity. A single merino sweater outlasts five fast-fashion knits and looks better every season. Invest where it counts, and let the rest be simple and dependable.',
      'The payoff is real: less clutter, faster mornings, and a closet where everything you own actually gets worn.'
    ]
  },
  {
    slug: 'choosing-your-first-mirrorless-camera',
    title: 'Choosing Your First Mirrorless Camera',
    excerpt: 'Megapixels are the least interesting spec. What actually makes a camera worth buying in 2026, and how to avoid overpaying.',
    author: 'Nour Ali',
    date: '2026-05-30',
    readMinutes: 8,
    tag: 'Tech',
    cover: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1200&q=80',
    body: [
      'Every camera brand wants you to obsess over resolution. In practice, autofocus reliability, in-body stabilization, and lens availability shape your photos far more than a few extra megapixels.',
      'For most people starting out, a full-frame body like the Sony Alpha a7 III still hits the sweet spot: excellent low-light performance, dependable tracking, and a huge ecosystem of affordable lenses.',
      'Buy the body you can grow into, but spend your real budget on glass. A good prime lens will outlive several camera bodies and make the biggest visible difference in your work.',
      'Whatever you choose, the best camera is the one you carry. Prioritize size and comfort — a capable camera left at home takes no pictures at all.'
    ]
  },
  {
    slug: 'the-art-of-pour-over-coffee',
    title: 'The Art of Pour-Over Coffee at Home',
    excerpt: 'A ceramic dripper, fresh beans, and ninety seconds of attention. The simplest upgrade to your morning routine.',
    author: 'Mina Adel',
    date: '2026-05-12',
    readMinutes: 5,
    tag: 'Home',
    cover: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80',
    body: [
      'Pour-over coffee sounds fussy, but it is really just controlled patience. Water, ground coffee, and a steady hand produce a cleaner, brighter cup than any pod machine.',
      'Start with a burr grinder and beans no older than two weeks. Grind slightly coarser than table salt, and use water just off the boil — around 96°C.',
      'Bloom the grounds with a small splash of water for thirty seconds, then pour in slow, concentric circles. The whole ritual takes under three minutes and rewards you every single morning.',
      'The gear is simple and lasts for years. A single ceramic dripper and carafe is all you need to make cafe-quality coffee at home.'
    ]
  },
  {
    slug: 'why-we-obsess-over-the-details',
    title: 'Why We Obsess Over the Details',
    excerpt: 'From stitching to packaging, the small decisions are the whole product. A note on how we choose what to sell.',
    author: 'The coDoc Team',
    date: '2026-04-22',
    readMinutes: 4,
    tag: 'Behind the Scenes',
    cover: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
    body: [
      'We do not carry a product until we have used it ourselves. Every item on the shelf earns its place by being genuinely good — not just photogenic.',
      'That means checking the stitching on a jacket, the weight of a wallet, and how a speaker actually sounds in a real room, not a spec sheet.',
      'Curation is a promise. When you buy from us, you are trusting that we already did the filtering — and we take that seriously.',
      'The result is a smaller catalog than most stores, and that is the point. Everything here is something we would happily own.'
    ]
  }
];

export const getPostBySlug = slug => blogPosts.find(post => post.slug === slug) || null;
