// app/articles/[id]/page.tsx
export const dynamic = 'force-dynamic';

import { ArticleClientPage } from '@/components/article-client-page';
import {
  getPost,
  transformPost,
  getPosts,
  TransformedPost,
  fallbackPosts,
} from '@/lib/wordpress';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const postId = parseInt(params.id, 10);
  const post = await getPost(postId).catch(() => null);
  const fallbackPost = fallbackPosts.find((p) => p.id === postId);

  const title = post?.title?.rendered || fallbackPost?.title || 'Article';
  const description =
    post?.excerpt?.rendered || fallbackPost?.excerpt || 'News article';

  return {
    title: title.replace(/<\/?[^>]+(>|$)/g, ''),
    description: description.replace(/<\/?[^>]+(>|$)/g, ''),
  };
}

interface ArticlePageProps {
  params: {
    id: string;
  };
}

async function getArticleData(id: string): Promise<TransformedPost | null> {
  try {
    const postId = parseInt(id);
    if (isNaN(postId)) return null;

    const post = await getPost(postId);
    if (post) return transformPost(post);
  } catch {
    const fallbackPost = fallbackPosts.find((p) => p.id === parseInt(id));
    if (fallbackPost) return fallbackPost;
  }

  return createDynamicFallbackArticle(parseInt(id));
}

function createDynamicFallbackArticle(id: number): TransformedPost {
  const categories = ['Politics', 'Business', 'Technology', 'Health', 'Sports', 'Entertainment'];
  const authors = ['Sarah Mitchell', 'Michael Chen', 'Dr. Amanda Rodriguez', 'David Park', 'Emma Thompson', 'Robert Wilson'];
  const images = [
    'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg',
    'https://images.pexels.com/photos/3861972/pexels-photo-3861972.jpeg',
    'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg',
    'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg',
    'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg',
    'https://images.pexels.com/photos/2990644/pexels-photo-2990644.jpeg',
  ];

  const category = categories[id % categories.length];
  const author = authors[id % authors.length];
  const image = images[id % images.length];

  return {
    id,
    title: `Article ${id}: Updates in ${category}`,
    excerpt: `Brief overview of key developments in ${category.toLowerCase()}.`,
    content: `<p>This is a fallback article for ${category}.</p>`,
    category,
    image,
    author,
    readTime: `${Math.floor(Math.random() * 5) + 4} min read`,
    views: `${(Math.random() * 10 + 1).toFixed(1)}k views`,
    publishDate: new Date().toISOString(),
    slug: `article-${id}`,
    tags: [category.toLowerCase(), 'news'],
    featured: Math.random() > 0.7,
    isTrending: Math.random() > 0.8,
    isBreaking: Math.random() > 0.9,
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await getArticleData(params.id);

  if (!article) {
    notFound();
  }

  return (
    <ArticleClientPage
      article={{
        id: article.id,
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        category: article.category,
        image: article.image,
        author: {
          name: article.author,
          bio: `${article.author} is a regular contributor.`,
          avatar:
            'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150',
        },
        publishDate: article.publishDate,
        readTime: article.readTime,
        views: article.views,
        likes: Math.floor(Math.random() * 500) + 50,
        comments: Math.floor(Math.random() * 100) + 10,
        shares: Math.floor(Math.random() * 200) + 20,
        tags: article.tags,
      }}
    />
  );
}
