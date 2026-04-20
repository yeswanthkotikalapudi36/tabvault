import React, { useState } from 'react';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import { ChevronLeft, Search, Filter, Plus, Trash2, FolderOpen, Edit3 } from 'lucide-react';
import { useCollections, Collection } from '../hooks/useCollections';
import { useLinks, LinkItem } from '../hooks/useLinks';
import { LinkCard } from '../components/LinkCard';
import { AddLinkModal } from '../components/AddLinkModal';
import { AddCollectionModal } from '../components/AddCollectionModal';
import { motion } from 'motion/react';

export default function CollectionView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { collections, deleteCollection } = useCollections();
  const { links, loading } = useLinks(id);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isCollModalOpen, setIsCollModalOpen] = useState(false);
  const [linkToEdit, setLinkToEdit] = useState<LinkItem | null>(null);

  const collection = collections.find(c => c.id === id);

  if (!collection && !loading) {
     return (
       <div className="flex flex-col items-center justify-center p-20 text-center">
         <FolderOpen className="w-16 h-16 text-gray-200 mb-4" />
         <h2 className="text-xl font-bold text-primary">Collection not found</h2>
         <RouterLink to="/home" className="mt-4 text-accent font-bold hover:underline">Back to Dashboard</RouterLink>
       </div>
     );
  }

  const filteredLinks = links.filter(link => 
    link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    link.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    link.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCollDelete = async () => {
    if (window.confirm('Are you sure you want to delete this collection? The links will remain in your vault.')) {
      await deleteCollection(id!);
      navigate('/home');
    }
  };

  const handleEditLink = (link: LinkItem) => {
    setLinkToEdit(link);
    setIsLinkModalOpen(true);
  };

  const handleOpenAddLink = () => {
    setLinkToEdit(null);
    setIsLinkModalOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
           <RouterLink to="/home" className="p-2 hover:bg-white rounded-xl border border-transparent hover:border-gray-100 transition-all text-gray-400 hover:text-primary">
             <ChevronLeft className="w-6 h-6" />
           </RouterLink>
           <div>
              <div className="flex items-center space-x-2">
                <span className="text-3xl">{collection?.emoji}</span>
                <h1 className="text-3xl font-bold text-primary tracking-tight">{collection?.name}</h1>
                <button 
                  onClick={() => setIsCollModalOpen(true)}
                  className="p-1.5 text-gray-300 hover:text-accent hover:bg-accent/5 rounded-lg transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">{links.length} SAVED ITEMS</p>
           </div>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={handleCollDelete}
            className="p-3 text-red-500 hover:bg-red-50 rounded-2xl transition-colors border border-transparent hover:border-red-100"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <button 
            onClick={handleOpenAddLink}
            className="flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-2xl font-bold hover:bg-primary/90 transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>Add Link</span>
          </button>
        </div>
      </header>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
           <input 
             type="text"
             placeholder="Search within this collection..."
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             className="w-full bg-white border border-gray-100 rounded-2xl py-3.5 pl-11 pr-4 outline-none focus:border-accent shadow-sm focus:shadow-md transition-all text-sm font-medium"
           />
        </div>
        <button className="bg-white border border-gray-100 px-6 py-3.5 rounded-2xl text-gray-600 font-bold text-sm flex items-center space-x-2 hover:shadow-md transition-all shadow-sm">
           <Filter className="w-4 h-4" />
           <span>Filters</span>
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
           {[1, 2, 3, 4, 5, 6].map(i => (
             <div key={i} className="aspect-[3/4] bg-white rounded-[24px] border border-gray-50 animate-shimmer" />
           ))}
        </div>
      ) : filteredLinks.length === 0 ? (
        <div className="py-24 bg-white rounded-[32px] border border-gray-50 flex flex-col items-center justify-center text-center">
           <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <FolderOpen className="w-10 h-10 text-gray-200" />
           </div>
           <h3 className="text-xl font-bold text-primary mb-2">No links found</h3>
           <p className="text-gray-500 max-w-xs mx-auto">This collection is currently empty or doesn't match your search criteria.</p>
           <button 
             onClick={handleOpenAddLink}
             className="mt-8 bg-accent text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-accent/20 hover:scale-105 transition-transform"
           >
             Save new URL
           </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredLinks.map((link) => (
            <LinkCard key={link.id} link={link} onEdit={handleEditLink} />
          ))}
        </div>
      )}

      <AddLinkModal
        isOpen={isLinkModalOpen}
        onClose={() => {
          setIsLinkModalOpen(false);
          setLinkToEdit(null);
        }}
        linkToEdit={linkToEdit}
      />
      
      <AddCollectionModal
        isOpen={isCollModalOpen}
        onClose={() => setIsCollModalOpen(false)}
        collectionToEdit={collection}
      />
    </div>
  );
}
