const PORTFOLIO = [
  { category: 'Business Cards', items: ['card1.jpeg','card2.jpeg','card3.jpeg','card4.jpeg','card5.jpeg','card6.jpeg'] },
  { category: 'Posters',        items: ['poster1.jpeg','poster2.jpeg','poster3.jpeg','poster4.jpeg','poster5.jpeg','poster6.jpeg'] },
  { category: 'Stickers',       items: ['sticker1.jpeg','sticker2.jpeg','sticker3.jpeg','sticker4.jpeg','sticker5.jpeg','sticker6.jpeg'] },
  { category: 'Invitations',    items: ['invite1.jpeg','invite2.jpeg','invite3.jpeg','invite4.jpeg','invite5.jpeg','invite6.jpeg'] },
];

const Portfolio = () => (
  <div className="min-h-screen bg-gradient-to-br from-[#00416A] to-[#1a1a2e] pb-16">
    <div className="text-center py-16 px-6">
      <h1 className="text-5xl font-extrabold text-[#FFA500]">Our Portfolio</h1>
      <p className="text-gray-300 mt-4 max-w-xl mx-auto">
        A showcase of our premium printing work across all categories.
      </p>
    </div>

    <div className="max-w-6xl mx-auto px-6 space-y-16">
      {PORTFOLIO.map(({ category, items }) => (
        <div key={category}>
          <h2 className="text-2xl font-bold text-[#FFA500] mb-6 border-l-4 border-[#FFA500] pl-4">{category}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {items.map((img, i) => (
              <div key={i} className="bg-[#00416A] rounded-2xl overflow-hidden shadow-xl hover:scale-105 transition duration-300">
                <img
                  src={`/${img}`}
                  alt={`${category} ${i + 1}`}
                  className="w-full h-48 object-cover"
                  onError={e => { e.target.style.display = 'none'; }}
                />
                <p className="text-white text-sm font-semibold text-center py-3">{category} Design {i + 1}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>

    <footer className="bg-[#1B1B1B] text-gray-300 text-center py-6 mt-16">
      <p>&copy; 2025 IndiArt Digital. All Rights Reserved.</p>
    </footer>
  </div>
);

export default Portfolio;