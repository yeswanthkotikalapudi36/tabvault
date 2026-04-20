import React, { useState, useEffect } from 'react';
import { X, Save, Tag, FileText, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useFetchMeta } from '../hooks/useFetchMeta';
import { useLinks, LinkItem } from '../hooks/useLinks';
import { useCollections } from '../hooks/useCollections';

interface AddLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialUrl?: string;
  linkToEdit?: LinkItem | null;
}

export const AddLinkModal: React.FC<AddLinkModalProps> = ({ isOpen, onClose, initialUrl, linkToEdit }) => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [favicon, setFavicon] = useState('');
  const [tags, setTags] = useState('');
  const [note, setNote] = useState('');
  const [collectionId, setCollectionId] = useState('');
  
  const { fetchMeta, loading: fetchLoading } = useFetchMeta();
  const { addLink, updateLink } = useLinks();
  const { collections } = useCollections();

  useEffect(() => {
    if (isOpen) {
      if (linkToEdit) {
        setUrl(linkToEdit.url);
        setTitle(linkToEdit.title);
        setDescription(linkToEdit.description || '');
        setThumbnail(linkToEdit.thumbnail || '');
        setFavicon(linkToEdit.favicon || '');
        setTags(linkToEdit.tags?.join(', ') || '');
        setNote(linkToEdit.note || '');
        setCollectionId(linkToEdit.collectionId || '');
      } else if (initialUrl) {
        setUrl(initialUrl);
        handleFetchMeta(initialUrl);
      } else {
        resetForm();
      }
    }
  }, [isOpen, linkToEdit, initialUrl]);

  const handleFetchMeta = async (targetUrl: string) => {
    if (!targetUrl) return;
    const meta = await fetchMeta(targetUrl);
    if (meta) {
      setTitle(meta.title);
      setDescription(meta.description);
      setThumbnail(meta.thumbnail);
      setFavicon(meta.favicon);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const linkData = {
      url,
      title,
      description,
      thumbnail,
      favicon,
      tags: tags.split(',').map(t => t.trim()).filter(t => t !== ''),
      note,
      collectionId: collectionId || 'uncategorized'
    };

    if (linkToEdit) {
      await updateLink(linkToEdit.id, linkData);
    } else {
      await addLink(linkData);
    }
    
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setUrl('');
    setTitle('');
    setDescription('');
    setThumbnail('');
    setFavicon('');
    setTags('');
    setNote('');
    setCollectionId('');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           onClick={onClose}
           className="absolute inset-0 bg-primary/40 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
        >
          {/* Form Side */}
          <div className="flex-1 p-8 overflow-y-auto">
             <div className="flex items-center justify-between mb-8">
               <h2 className="text-2xl font-bold text-primary">{linkToEdit ? 'Edit Link' : 'Save New Link'}</h2>
               <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
                 <X className="w-5 h-5" />
               </button>
             </div>

             <form onSubmit={handleSave} className="space-y-6">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Url</label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                    <input
                      type="url"
                      required
                      value={url}
                      onBlur={() => handleFetchMeta(url)}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://example.com"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-accent transition-all disabled:opacity-50"
                      disabled={!!linkToEdit}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Page Title"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 outline-none focus:border-accent font-semibold flex-shrink-0"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Collection</label>
                    <select
                      value={collectionId}
                      onChange={(e) => setCollectionId(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-3 outline-none focus:border-accent text-sm appearance-none"
                    >
                      <option value="">Uncategorized</option>
                      {collections.map(c => (
                        <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Tags (Comma sep)</label>
                    <div className="relative">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                      <input
                        type="text"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="design, tech..."
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-accent text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                   <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Personal Note</label>
                   <div className="relative">
                      <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-300" />
                      <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Why are you saving this? (max 280 chars)"
                        maxLength={280}
                        rows={3}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-accent text-sm resize-none"
                      />
                   </div>
                </div>

                <button
                  type="submit"
                  disabled={fetchLoading}
                  className="w-full bg-accent text-white font-bold py-4 rounded-xl shadow-lg shadow-accent/25 hover:bg-accent/90 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 mt-4"
                >
                  <Save className="w-5 h-5" />
                  <span>{linkToEdit ? 'Save Changes' : 'Save to Vault'}</span>
                </button>
             </form>
          </div>

          {/* Preview Side */}
          <div className="hidden md:block w-72 bg-gray-50 border-l border-gray-100 p-8">
             <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Live Preview</h3>
             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="aspect-video bg-gray-200 relative overflow-hidden">
                   {fetchLoading ? (
                     <div className="absolute inset-0 animate-shimmer" />
                   ) : thumbnail ? (
                     <img src={thumbnail} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                   ) : (
                     <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                       <LinkIcon className="w-8 h-8" />
                     </div>
                   )}
                </div>
                <div className="p-4 space-y-2">
                   <div className="flex items-center space-x-2">
                      {favicon && <img src={favicon} className="w-4 h-4 rounded-sm" referrerPolicy="no-referrer" />}
                      <span className="text-[10px] font-bold text-gray-400 truncate uppercase tracking-wider">{url ? (url.startsWith('http') ? new URL(url).hostname : 'DOMAIN') : 'DOMAIN'}</span>
                   </div>
                   <h4 className="text-sm font-bold text-primary line-clamp-2 leading-tight">{title || 'Save your first link to see a preview.'}</h4>
                   <p className="text-[11px] text-gray-500 line-clamp-2">{description || 'Metadata will be automatically fetched for you.'}</p>
                </div>
             </div>
             
             {fetchLoading && (
               <div className="mt-6 flex items-center space-x-2 text-accent p-3 bg-accent/5 rounded-xl border border-accent/10 animate-pulse">
                  <div className="w-4 h-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                  <span className="text-xs font-bold uppercase tracking-widest">Fetching data...</span>
               </div>
             )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
