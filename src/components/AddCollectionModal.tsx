import React, { useState, useEffect } from 'react';
import { X, Save, FolderPlus, Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCollections, Collection } from '../hooks/useCollections';

interface AddCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  collectionToEdit?: Collection | null;
}

const COLORS = [
  { name: 'Violet', hex: '#7C3AED' },
  { name: 'Red', hex: '#EF4444' },
  { name: 'Blue', hex: '#3B82F6' },
  { name: 'Green', hex: '#10B981' },
  { name: 'Orange', hex: '#F59E0B' },
  { name: 'Pink', hex: '#EC4899' },
  { name: 'Navy', hex: '#1E1E2E' },
];

const EMOJIS = ['📁', '📚', '🚀', '🎨', '💻', '💡', '🛠️', '📝', '🌟', '🎧', '⚡', '🎮'];

export const AddCollectionModal: React.FC<AddCollectionModalProps> = ({ isOpen, onClose, collectionToEdit }) => {
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState(EMOJIS[0]);
  const [colorAccent, setColorAccent] = useState(COLORS[0].hex);
  const { addCollection, updateCollection } = useCollections();

  useEffect(() => {
    if (isOpen) {
      if (collectionToEdit) {
        setName(collectionToEdit.name);
        setEmoji(collectionToEdit.emoji);
        setColorAccent(collectionToEdit.colorAccent);
      } else {
        setName('');
        setEmoji(EMOJIS[0]);
        setColorAccent(COLORS[0].hex);
      }
    }
  }, [isOpen, collectionToEdit]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (collectionToEdit) {
      await updateCollection(collectionToEdit.id, { name, emoji, colorAccent });
    } else {
      await addCollection(name, emoji, colorAccent);
    }
    onClose();
    setName('');
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
          className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl p-8"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-primary">{collectionToEdit ? 'Edit Collection' : 'New Collection'}</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-8">
             <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Collection Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Design Inspiration"
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-6 outline-none focus:border-accent text-lg font-bold"
                />
             </div>

             <div className="space-y-4">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1 flex items-center space-x-2">
                   <Palette className="w-4 h-4" />
                   <span>Appearance</span>
                </label>
                
                <div className="flex flex-wrap gap-3">
                   {EMOJIS.map(e => (
                     <button
                       key={e}
                       type="button"
                       onClick={() => setEmoji(e)}
                       className={`w-12 h-12 flex items-center justify-center text-xl rounded-xl transition-all border-2 ${emoji === e ? 'border-accent bg-accent/5' : 'border-transparent bg-gray-50 hover:bg-gray-100'}`}
                     >
                       {e}
                     </button>
                   ))}
                </div>

                <div className="flex flex-wrap gap-3">
                   {COLORS.map(c => (
                     <button
                       key={c.hex}
                       type="button"
                       onClick={() => setColorAccent(c.hex)}
                       className={`w-8 h-8 rounded-full transition-all border-4 ${colorAccent === c.hex ? 'border-white ring-2 ring-accent shadow-lg' : 'border-transparent hover:scale-110'}`}
                       style={{ backgroundColor: c.hex }}
                       title={c.name}
                     />
                   ))}
                </div>
             </div>

             <button
                type="submit"
                className="w-full bg-accent text-white font-bold py-4 rounded-2xl shadow-lg shadow-accent/25 hover:bg-accent/90 transition-all flex items-center justify-center space-x-2"
              >
                {collectionToEdit ? (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Save Changes</span>
                  </>
                ) : (
                  <>
                    <FolderPlus className="w-5 h-5" />
                    <span>Create Collection</span>
                  </>
                )}
              </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
