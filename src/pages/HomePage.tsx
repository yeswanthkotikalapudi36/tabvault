import React, { useState } from 'react';
import { ArrowRight, Plus, FolderPlus, Compass } from 'lucide-react';
import { useCollections } from '../hooks/useCollections';
import { useLinks } from '../hooks/useLinks';
import { AddLinkModal } from '../components/AddLinkModal';
import { AddCollectionModal } from '../components/AddCollectionModal';
import { CollectionCard } from '../components/CollectionCard';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  const { collections, loading: collLoading } = useCollections();
  const { links } = useLinks();
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isCollModalOpen, setIsCollModalOpen] = useState(false);
  const [pastedUrl, setPastedUrl] = useState('');

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (pastedUrl) {
      setIsLinkModalOpen(true);
    }
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Hero / Rediscover Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-primary rounded-[32px] p-8 md:p-12 text-white relative overflow-hidden"
      >
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center space-x-2 mb-4">
             <div className="bg-accent/20 p-1 rounded-md">
                <Compass className="w-4 h-4 text-accent" />
             </div>
             <span className="text-xs font-bold uppercase tracking-widest text-accent">Intelligent Feed</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Rediscover forgotten knowledge.</h1>
          <p className="text-gray-300 mb-8 max-w-md leading-relaxed">You have {links.length} items in your vault. We've picked 3 random links you haven't visited in a while.</p>
          <Link
            to="/rediscover"
            className="inline-flex items-center space-x-2 bg-accent text-white px-6 py-3 rounded-xl font-bold hover:bg-accent/90 transition-all shadow-lg shadow-accent/25"
          >
            <span>Start Rediscover Mode</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mb-10"></div>
      </motion.div>

      {/* Quick Add Section */}
      <section className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm">
        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4 ml-1">Quick Save</h2>
        <form onSubmit={handleQuickAdd} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="url"
              placeholder="Paste a URL to save instantly..."
              value={pastedUrl}
              onChange={(e) => setPastedUrl(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-6 pr-4 outline-none focus:border-accent transition-all text-sm font-medium"
            />
          </div>
          <button
            type="submit"
            className="bg-primary text-white px-8 py-4 rounded-2xl font-bold hover:bg-primary/90 transition-all flex items-center justify-center space-x-2 shrink-0"
          >
            <Plus className="w-5 h-5" />
            <span>Add to Vault</span>
          </button>
        </form>
      </section>

      {/* Collections Grid */}
      <section>
        <div className="flex items-center justify-between mb-6 px-1">
          <h2 className="text-xl font-bold text-primary tracking-tight">Your Collections</h2>
          <button 
            onClick={() => setIsCollModalOpen(true)}
            className="text-sm font-bold text-accent hover:underline flex items-center space-x-1"
          >
            <FolderPlus className="w-4 h-4" />
            <span>Create New</span>
          </button>
        </div>

        {collLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-48 bg-white border border-gray-100 rounded-[24px] animate-shimmer" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {collections.length === 0 ? (
              <div className="col-span-full py-12 bg-white rounded-[24px] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-gray-400">
                <FolderPlus className="w-12 h-12 mb-4 opacity-20" />
                <p className="font-semibold">No collections yet</p>
                <p className="text-xs">Group your links into visual categories</p>
              </div>
            ) : (
              collections.map((coll) => {
                const collLinks = links.filter(l => l.collectionId === coll.id);
                const thumbs = collLinks.map(l => l.thumbnail).filter(Boolean);
                return (
                  <CollectionCard key={coll.id} collection={coll} thumbnails={thumbs} />
                );
              })
            )}
          </div>
        )}
      </section>

      {/* Modals */}
      <AddLinkModal
        isOpen={isLinkModalOpen}
        onClose={() => {
          setIsLinkModalOpen(false);
          setPastedUrl('');
        }}
        initialUrl={pastedUrl}
      />
      
      <AddCollectionModal 
        isOpen={isCollModalOpen}
        onClose={() => setIsCollModalOpen(false)}
      />
    </div>
  );
}
