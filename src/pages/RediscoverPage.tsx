import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { RefreshCw, ExternalLink, ChevronLeft, Sparkles, BookOpen } from 'lucide-react';
import { useRediscover } from '../hooks/useRediscover';
import { motion, AnimatePresence } from 'motion/react';

export default function RediscoverPage() {
  const { picks, shuffle, loading, markAsVisited } = useRediscover();

  const handleVisit = (id: string, url: string) => {
    markAsVisited(id);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
           <RouterLink to="/home" className="p-2 hover:bg-white rounded-xl border border-transparent hover:border-gray-100 transition-all text-gray-400 hover:text-primary">
             <ChevronLeft className="w-6 h-6" />
           </RouterLink>
           <div>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-6 h-6 text-accent fill-accent/20" />
                <h1 className="text-3xl font-bold text-primary tracking-tight">Rediscover</h1>
              </div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Bringing your vault back to life</p>
           </div>
        </div>

        <button 
          onClick={shuffle}
          className="flex items-center justify-center space-x-2 bg-white border border-gray-100 text-primary px-8 py-4 rounded-2xl font-bold hover:shadow-lg transition-all shadow-sm"
        >
          <RefreshCw className="w-5 h-5" />
          <span>Shuffle Picks</span>
        </button>
      </header>

      {/* Main Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {[1, 2, 3].map(i => (
             <div key={i} className="aspect-[4/5] bg-white rounded-[40px] animate-shimmer" />
           ))}
        </div>
      ) : picks.length === 0 ? (
        <div className="py-32 bg-white rounded-[40px] border border-gray-50 flex flex-col items-center justify-center text-center px-6">
           <div className="w-24 h-24 bg-accent/5 rounded-full flex items-center justify-center mb-8">
              <BookOpen className="w-12 h-12 text-accent" />
           </div>
           <h3 className="text-2xl font-bold text-primary mb-4">Your vault is ready</h3>
           <p className="text-gray-500 max-w-sm mx-auto leading-relaxed">Save more links to start rediscovering. We highlight items you haven't visited in over 7 days.</p>
           <RouterLink 
             to="/home"
             className="mt-8 bg-primary text-white px-10 py-4 rounded-2xl font-bold hover:scale-105 transition-transform shadow-xl shadow-primary/20"
           >
             Go to Vault
           </RouterLink>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {picks.map((link, index) => (
              <motion.div
                key={link.id}
                layout
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ delay: index * 0.1, duration: 0.5, type: 'spring', bounce: 0.3 }}
                className="group relative flex flex-col bg-white rounded-[40px] border border-gray-100 overflow-hidden shadow-xl hover:shadow-2xl transition-all h-[550px]"
              >
                 {/* Large Thumbnail Area */}
                 <div className="h-2/3 relative overflow-hidden bg-gray-50">
                    {link.thumbnail ? (
                      <img src={link.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                         <div className="text-9xl opacity-5 select-none font-bold italic">{link.title[0]}</div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-60" />
                    
                    <div className="absolute bottom-6 left-8 right-8">
                       <div className="flex items-center space-x-2 mb-2">
                          {link.favicon && <img src={link.favicon} className="w-5 h-5 rounded shadow-sm" referrerPolicy="no-referrer" />}
                          <span className="text-[11px] font-bold text-white uppercase tracking-widest opacity-80">{new URL(link.url).hostname}</span>
                       </div>
                       <h2 className="text-xl font-bold text-white leading-tight line-clamp-3">{link.title}</h2>
                    </div>
                 </div>

                 {/* Content Area */}
                 <div className="flex-1 p-8 flex flex-col">
                    <p className="text-sm text-gray-500 line-clamp-3 mb-6 leading-relaxed">
                      {link.description || 'Pulling this back from your vault for a revisit.'}
                    </p>

                    <div className="mt-auto flex items-center justify-between">
                       <button 
                         onClick={() => handleVisit(link.id, link.url)}
                         className="flex-1 bg-accent text-white px-6 py-4 rounded-2xl font-bold flex items-center justify-center space-x-3 hover:bg-accent/90 transition-all shadow-lg shadow-accent/20"
                       >
                         <ExternalLink className="w-5 h-5" />
                         <span>Rediscover Now</span>
                       </button>
                    </div>
                 </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {picks.length > 0 && (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
           <div className="flex items-center space-x-2 text-gray-400">
              <span className="w-8 h-px bg-gray-200"></span>
              <span className="text-xs font-bold uppercase tracking-widest italic">Curated for you</span>
              <span className="w-8 h-px bg-gray-200"></span>
           </div>
           <p className="text-sm text-gray-500 text-center max-w-sm">Not feeling these? Shuffle again to find other hidden gems in your library.</p>
        </div>
      )}
    </div>
  );
}
