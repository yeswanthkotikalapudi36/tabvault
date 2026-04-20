import React from 'react';
import { ExternalLink, Trash2, Calendar, Tag, Edit2 } from 'lucide-react';
import { LinkItem, useLinks } from '../hooks/useLinks';
import { motion } from 'motion/react';
import { formatDistanceToNow } from 'date-fns';

interface LinkCardProps {
  link: LinkItem;
  onEdit?: (link: LinkItem) => void;
}

export const LinkCard: React.FC<LinkCardProps> = ({ link, onEdit }) => {
  const { deleteLink, markAsVisited } = useLinks();

  const handleVisit = () => {
    markAsVisited(link.id);
    window.open(link.url, '_blank', 'noopener,noreferrer');
  };

  const savedDate = link.savedAt?.toDate ? link.savedAt.toDate() : new Date();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-[24px] border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-shadow group h-full flex flex-col"
    >
      {/* Thumbnail */}
      <div className="aspect-video bg-gray-100 relative overflow-hidden shrink-0">
        {link.thumbnail ? (
          <img 
            src={link.thumbnail} 
            alt={link.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <ExternalLink className="w-8 h-8" />
          </div>
        )}
        
        {/* Favicon Overlay */}
        <div className="absolute top-4 left-4 p-1.5 bg-white/90 backdrop-blur rounded-lg shadow-sm border border-white/20">
           {link.favicon ? (
             <img src={link.favicon} alt="" className="w-4 h-4" referrerPolicy="no-referrer" />
           ) : (
             <ExternalLink className="w-4 h-4 text-gray-400" />
           )}
        </div>

        {/* Action button overlay on hover */}
        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3">
           <button 
             onClick={handleVisit}
             className="bg-white text-primary px-4 py-2 rounded-xl font-bold text-sm shadow-xl flex items-center space-x-2 translate-y-2 group-hover:translate-y-0 transition-transform"
           >
             <ExternalLink className="w-4 h-4" />
             <span>Visit Site</span>
           </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-2">
          <span className="text-[10px] font-bold text-accent uppercase tracking-widest truncate max-w-[150px]">
            {new URL(link.url).hostname}
          </span>
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onEdit && (
              <button 
                onClick={() => onEdit(link)}
                className="p-1.5 text-gray-300 hover:text-accent hover:bg-accent/5 rounded-lg transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
            <button 
              onClick={() => deleteLink(link.id)}
              className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <h3 className="text-base font-bold text-primary mb-2 line-clamp-2 leading-tight group-hover:text-accent transition-colors">
          {link.title}
        </h3>
        
        <p className="text-xs text-gray-500 line-clamp-2 mb-4 leading-relaxed">
          {link.description || 'No description available for this link.'}
        </p>

        {link.note && (
          <div className="mb-4 p-3 bg-gray-50 rounded-xl border-l-4 border-accent/20">
            <p className="text-[11px] font-medium text-gray-600 line-clamp-2">
              <span className="text-accent italic mr-1">Note:</span>
              {link.note}
            </p>
          </div>
        )}

        <div className="mt-auto space-y-3">
          {link.tags && link.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {link.tags.map(tag => (
                <span key={tag} className="text-[10px] font-bold bg-accent/5 text-accent px-2 py-0.5 rounded-full border border-accent/10">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest pt-3 border-t border-gray-50">
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDistanceToNow(savedDate)} ago</span>
            </div>
            {link.lastVisitedAt && (
              <span className="text-accent/60 italic">Visited</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
