import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SEED_BLOGS } from '../../constants/seedData';
import { BookOpen, Calendar, Clock, ArrowRight, User } from 'lucide-react';

export const BlogList = () => {
  const [blogs, setBlogs] = useState(SEED_BLOGS);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand-gold flex items-center justify-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5" /> THE ROYAL OLFACTORY JOURNAL
        </span>
        <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-brand-emerald">
          Chronicles of Arabian Perfumery
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 font-light leading-relaxed">
          Essays, botanical expeditions, and master distillation secrets from the private notebooks of AB Noor.
        </p>
      </div>

      {/* Grid of Articles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {blogs.map((blog) => (
          <article
            key={blog.id}
            className="group bg-white rounded-3xl overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-luxury hover:border-brand-gold/60 transition-all duration-300 flex flex-col"
          >
            <Link to={`/blog/${blog.slug}`} className="aspect-[16/10] overflow-hidden bg-stone-100 block">
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </Link>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-[10px] text-brand-gold font-bold uppercase tracking-wider">
                  <span>{blog.category}</span>
                  <span>•</span>
                  <span>{blog.readTime}</span>
                </div>

                <Link to={`/blog/${blog.slug}`}>
                  <h3 className="font-playfair font-bold text-lg text-brand-emerald group-hover:text-brand-gold transition leading-snug">
                    {blog.title}
                  </h3>
                </Link>

                <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed font-light">
                  {blog.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400">
                <span className="text-[11px] flex items-center gap-1">
                  <User className="w-3 h-3 text-brand-gold" />
                  <span className="truncate max-w-[140px]">{blog.author}</span>
                </span>
                <Link
                  to={`/blog/${blog.slug}`}
                  className="text-brand-emerald font-semibold hover:text-brand-gold inline-flex items-center gap-1 transition"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

    </div>
  );
};
