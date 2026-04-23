import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const contentDir = path.join(process.cwd(), 'content');
  const indexPath = path.join(contentDir, 'index.json');
  
  if (!fs.existsSync(indexPath)) {
    notFound();
  }
  
  const articles = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
  const article = articles.find((a: any) => a.slug === params.slug);
  
  if (!article) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-emerald-800 mb-4">{article.title}</h1>
        <p className="text-gray-500 mb-6">{article.date}</p>
        
        <div 
          className="prose prose-emerald max-w-none"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
        
        <div className="mt-8 pt-6 border-t text-center">
          <Link href="/blog" className="text-emerald-600 hover:underline mr-4">
            ← All Articles
          </Link>
          <Link href="/" className="text-emerald-600 hover:underline">
            Try Carbon Calculator
          </Link>
        </div>
      </div>
    </main>
  );
}