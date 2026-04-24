const fs = require('fs');
const path = require('path');

const TOPICS = [
  "how to reduce carbon footprint in the USA 2026",
  "how to reduce carbon footprint in North America 2026",
  "how to reduce carbon footprint in Canada 2026",
  "solar panel rebates Ontario homeowners guide",
  "zero waste living tips for beginners",
  "carbon footprint calculator explained",
  "sustainable home energy savings",
  "eco-friendly products worth the investment",
  "how much CO2 do solar panels save",
  "green living on a budget",
  "carbon neutral lifestyle changes",
  "renewable energy for small homes"
];

async function generateArticle() {
  const topic = TOPICS[Math.floor(Math.random() * TOPICS.length)];
  const date = new Date().toISOString().split('T')[0];
  const slug = `article-${Date.now()}`;
  
  const prompt = `Write a 800-word SEO-optimized blog post about "${topic}" for EcoMetric, a carbon intelligence platform. Include: 1) An engaging introduction with a statistic, 2) 3 actionable tips, 3) A section about using a carbon calculator, 4) A soft call-to-action to explore sustainable solutions. Format as clean HTML with <h1>, <h2>, <p> tags. No CSS classes needed.`;
  
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );
    
    const data = await response.json();
    
    // Debug: log the response structure
    console.log('API Response:', JSON.stringify(data, null, 2));
    
    // Handle different response structures
    let content = '';
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
      content = data.candidates[0].content.parts[0].text;
    } else if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      content = data.candidates[0].content;
    } else {
      throw new Error('Unexpected API response structure: ' + JSON.stringify(data));
    }
    
    const article = {
      slug,
      title: topic.charAt(0).toUpperCase() + topic.slice(1),
      date,
      excerpt: content.substring(0, 150) + '...',
      content
    };
    
    const contentDir = path.join(__dirname, '..', 'content');
    if (!fs.existsSync(contentDir)) fs.mkdirSync(contentDir);
    
    fs.writeFileSync(
      path.join(contentDir, `${slug}.json`),
      JSON.stringify(article, null, 2)
    );
    
    const indexPath = path.join(contentDir, 'index.json');
    let index = [];
    if (fs.existsSync(indexPath)) {
      index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
    }
    index.unshift(article);
    fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
    
    console.log(`Generated: ${article.title}`);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

generateArticle();