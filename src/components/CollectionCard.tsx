import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Collection } from '../hooks/useCollections';
import { motion } from 'motion/react';

interface CollectionCardProps {
  collection: Collection;
  thumbnails?: string[];
}

export const CollectionCard: React.FC<CollectionCardProps> = ({ collection, thumbnails = [] }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link
        to={`/collection/${collection.id}`}
        className="group block bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
      >
        {/* Accent Bar */}
        <div 
          className="absolute top-0 left-0 bottom-0 w-1.5"
          style={{ backgroundColor: collection.colorAccent || '#7C3AED' }}
        />
        
        <div className="flex flex-col h-full">
           <div className="flex items-start justify-between mb-4">
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-gray-50"
                style={{ backgroundColor: `${collection.colorAccent}10` || '#F5F3FF' }}
              >
                {collection.emoji || '📁'}
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-accent transition-colors" />
           </div>
           
           <h3 className="text-lg font-bold text-primary mb-1 group-hover:text-accent transition-colors">{collection.name}</h3>
           <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
             {collection.linkCount || 0} Saved Links
           </p>
           
           {/* Thumbnail previews */}
           <div className="mt-6 flex -space-x-3 overflow-hidden">
             {thumbnails.length > 0 ? (
               thumbnails.slice(0, 3).map((thumb, i) => (
                 <div key={i} className="inline-block h-10 w-10 rounded-full border-2 border-white bg-gray-100 flex-shrink-0">
                   {thumb ? (
                     <img src={thumb} alt="" className="h-full w-full object-cover rounded-full" referrerPolicy="no-referrer" />
                   ) : (
                     <div className="h-full w-full bg-gray-200 rounded-full" />
                   )}
                 </div>
               ))
             ) : (
               [1, 2, 3].map(i => (
                  <div key={i} className="inline-block h-10 w-10 rounded-full border-2 border-white bg-gray-50 flex-shrink-0" />
               ))
             )}
           </div>
        </div>
      </Link>
    </motion.div>
  );
};
