import { copyFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'out',
  images: {
    unoptimized: true
  },
  webpack: (config: any, { isServer }: any) => {
    // Copy content to public folder after build
    if (!isServer) {
      const publicDir = join(process.cwd(), 'public');
      const contentDir = join(process.cwd(), 'content');
      const publicContentDir = join(publicDir, 'content');
      
      if (existsSync(contentDir)) {
        if (!existsSync(publicContentDir)) {
          mkdirSync(publicContentDir, { recursive: true });
        }
        
        // Copy index.json
        if (existsSync(join(contentDir, 'index.json'))) {
          copyFileSync(
            join(contentDir, 'index.json'),
            join(publicContentDir, 'index.json')
          );
        }
        
        // Copy all article files
        const files = require('fs').readdirSync(contentDir);
        files.forEach((file: string) => {
          if (file.endsWith('.json')) {
            copyFileSync(
              join(contentDir, file),
              join(publicContentDir, file)
            );
          }
        });
      }
    }
    return config;
  }
}

export default nextConfig;