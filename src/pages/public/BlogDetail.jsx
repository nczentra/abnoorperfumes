import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { SEED_BLOGS } from '../../constants/seedData';
import { ArrowLeft, Calendar, Clock, User, Share2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export const BlogDetail = () => {
  const { slug } = useParams();
  const blog = SEED_BLOGS.find(b => b.slug === slug) || SEED_BLOGS[0];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        text: blog.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Article link copied to clipboard!');
    }
  };

  return (
    <article className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      
      {/* Back button */}
      <div>
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-xs font-semibold text-brand-emerald hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to The Fragrance Journal</span>
        </Link>
      </div>

      {/* Article Header */}
      <div className="space-y-4">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-gold block">
          {blog.category} • {blog.readTime}
        </span>
        <h1 className="font-playfair text-3xl sm:text-5xl font-bold text-brand-emerald leading-tight">
          {blog.title}
        </h1>
        
        <div className="flex items-center justify-between pt-2 border-b border-stone-200 pb-4 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-brand-gold" />
            <span className="font-semibold text-stone-800">{blog.author}</span>
            <span>•</span>
            <span>{blog.date}</span>
          </div>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 text-stone-600 hover:text-brand-emerald transition"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Main Cover Image */}
      <div className="aspect-[16/9] rounded-3xl overflow-hidden shadow-luxury border border-stone-200">
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Article Body */}
      <div className="prose prose-stone max-w-none text-xs sm:text-sm text-stone-700 leading-relaxed font-light space-y-6 pt-4">
        {blog.content.split('\n\n').map((paragraph, i) => (
          <p key={i} className="leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>

      {/* Call to Action Box */}
      <div className="p-8 bg-brand-dark-forest text-white rounded-3xl border border-brand-gold/30 shadow-xl text-center space-y-4 my-12">
        <Sparkles className="w-6 h-6 text-brand-gold mx-auto" />
        <h3 className="font-playfair text-2xl font-bold text-brand-soft-gold">
          Experience the Scents Mentioned
        </h3>
        <p className="text-xs text-stone-300 max-w-md mx-auto font-light">
          Explore our rare Cambodian oud and Taif rose private reserves hand-poured in crystal flacons.
        </p>
        <div>
          <Link
            to="/shop"
            className="inline-block px-8 py-3 bg-brand-gold text-brand-dark-forest font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-brand-soft-gold transition shadow-lg"
          >
            Discover the Scents
          </Link>
        </div>
      </div>

    </article>
  );
};
