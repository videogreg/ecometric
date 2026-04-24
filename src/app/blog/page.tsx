'use client';
import { useState } from 'react';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';

type Article = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
};

export default function BlogPage() {
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null);
  
  const contentDir = path.join(process.cwd(), 'content');
  let articles: Article[] = [];
  
  try {
    const indexPath = path.join(contentDir, 'index.json');
    if (fs.existsSync(indexPath)) {
      articles = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
    }
  } catch {
    articles = [];
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">EcoMetric Blog</h1>
        <p className="text-emerald-300 mb-8">Sustainable living tips and carbon reduction guides</p>
        
        {articles.length === 0 ? (
          <p className="text-gray-500">Articles coming soon...</p>
        ) : (
          <div className="space-y-8">
            {articles.map((article: Article) => (
              <article key={article.slug} className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-emerald-800 mb-2">
                  {article.title}
                </h2>
                <p className="text-gray-500 text-sm mb-4">{article.date}</p>
                
                {expandedArticle === article.slug ? (
                  <div>
                    <div 
                      className="prose prose-emerald max-w-none text-gray-700 mb-4"
                      dangerouslySetInnerHTML={{ __html: article.content }}
                    />
                    <button 
                      onClick={() => setExpandedArticle(null)}
                      className="text-emerald-600 hover:text-emerald-800 text-sm font-semibold"
                    >
                      ↑ Show Less
                    </button>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-600 mb-4">{article.excerpt}</p>
                    <button 
                      onClick={() => setExpandedArticle(article.slug)}
                      className="text-emerald-600 hover:text-emerald-800 text-sm font-semibold"
                    >
                      Read Full Article →
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
        
        <div className="mt-8 text-center">
          <Link href="/" className="text-emerald-600 hover:underline">
            ← Back to Calculator
          </Link>
        </div>
      </div>
    </main>
  );
}