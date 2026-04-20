import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';

export interface Collection {
  id: string;
  userId: string;
  name: string;
  emoji: string;
  colorAccent: string;
  createdAt: any;
  linkCount: number;
}

export function useCollections() {
  const { user } = useAuth();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setCollections([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'users', user.uid, 'collections')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Collection[];
      setCollections(data);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching collections:", error);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const addCollection = async (name: string, emoji: string, colorAccent: string) => {
    if (!user) return;
    await addDoc(collection(db, 'users', user.uid, 'collections'), {
      userId: user.uid,
      name,
      emoji,
      colorAccent,
      createdAt: serverTimestamp(),
      linkCount: 0
    });
  };

  const deleteCollection = async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, 'users', user.uid, 'collections', id));
  };

  const updateCollection = async (id: string, data: Partial<Collection>) => {
    if (!user) return;
    await updateDoc(doc(db, 'users', user.uid, 'collections', id), data);
  };

  return { collections, loading, addCollection, deleteCollection, updateCollection };
}
