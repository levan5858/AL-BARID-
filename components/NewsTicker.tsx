'use client'

import { useEffect, useState } from 'react'

interface NewsArticle {
  title: string
  url: string
  source: string
}

export default function NewsTicker() {
  const [news, setNews] = useState<NewsArticle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true)
        const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY
        
        if (!apiKey) {
          // Fallback to mock news if API key is not configured
          setNews([
            { title: 'Global logistics industry sees 15% growth in 2024', url: '#', source: 'Logistics News' },
            { title: 'New shipping routes established across Middle East', url: '#', source: 'Trade Update' },
            { title: 'Digital transformation accelerates in freight sector', url: '#', source: 'Tech Logistics' },
            { title: 'E-commerce drives demand for express delivery services', url: '#', source: 'Market Watch' },
          ])
          setIsLoading(false)
          return
        }

        const response = await fetch(
          `https://newsapi.org/v2/everything?q=logistics shipping freight delivery&language=en&sortBy=publishedAt&pageSize=5&apiKey=${apiKey}`
        )

        if (!response.ok) {
          throw new Error('Failed to fetch news')
        }

        const data = await response.json()
        
        if (data.articles && data.articles.length > 0) {
          const articles: NewsArticle[] = data.articles.map((article: any) => ({
            title: article.title,
            url: article.url,
            source: article.source.name || 'News',
          }))
          setNews(articles)
        } else {
          // Fallback news
          setNews([
            { title: 'Global logistics industry continues to grow', url: '#', source: 'Logistics News' },
            { title: 'New shipping routes established across Middle East', url: '#', source: 'Trade Update' },
          ])
        }
      } catch (err) {
        console.error('Error fetching news:', err)
        setError('Failed to load news')
        // Fallback news on error
        setNews([
          { title: 'Global logistics industry sees significant growth', url: '#', source: 'Logistics News' },
          { title: 'Al Barid Logistics expands services across the region', url: '#', source: 'Company News' },
        ])
      } finally {
        setIsLoading(false)
      }
    }

    fetchNews()
  }, [])

  if (isLoading) {
    return (
      <div className="bg-primary-dark text-white py-3 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <span className="mr-4 font-bold">Latest News:</span>
            <span className="animate-pulse">Loading logistics news...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error && news.length === 0) {
    return null
  }

  return (
    <div className="bg-primary-dark text-white py-3 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <span className="mr-4 font-bold whitespace-nowrap">Latest News:</span>
          <div className="flex-1 overflow-hidden">
            <div className="animate-scroll whitespace-nowrap inline-block">
              {news.map((article, index) => (
                <span key={index} className="mx-8 inline-block">
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-accent transition-colors"
                  >
                    {article.title}
                  </a>
                  <span className="mx-4 text-gray-400">•</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}