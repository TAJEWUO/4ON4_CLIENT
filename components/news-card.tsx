"use client"

import { Heart, Share2, Repeat2 } from "lucide-react"
import { useState } from "react"

interface News {
  id: number
  title: string
  date: string
  excerpt: string
  image: string
  likes: number
  category: string
  bgColor: string
  textColor: string
}

export function NewsCard({ news }: { news: News }) {
  const [likes, setLikes] = useState(news.likes)
  const [isLiked, setIsLiked] = useState(false)

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikes(isLiked ? likes - 1 : likes + 1)
  }

  return (
    <div className={`border border-black/10 rounded-lg overflow-hidden hover:shadow-lg transition-all group`}>
      <div className={`${news.bgColor} ${news.textColor} p-3 h-20 flex flex-col justify-between`}>
        <p className="text-xs font-bold opacity-80 uppercase tracking-wide">{news.category}</p>
        <h3 className="font-bold text-sm leading-tight">{news.title}</h3>
      </div>

      <div className="p-3 space-y-2">
        <p className="text-xs text-black/60 font-medium">{news.date}</p>
        <p className="text-xs text-black/70 leading-relaxed line-clamp-2">{news.excerpt}</p>

        <div className="flex items-center justify-between pt-2 border-t border-black/10">
          <button
            onClick={handleLike}
            className="flex items-center gap-1 text-xs text-black/60 hover:text-red-600 transition-colors"
          >
            <Heart size={14} fill={isLiked ? "currentColor" : "none"} />
            <span>{likes}</span>
          </button>
          <button className="text-xs text-black/60 hover:text-black transition-colors flex items-center gap-1">
            <Share2 size={14} />
          </button>
          <button className="text-xs text-black/60 hover:text-black transition-colors flex items-center gap-1">
            <Repeat2 size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
