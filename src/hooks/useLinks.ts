import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, doc, updateDoc, deleteDoc, orderBy, increment } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';

export interface LinkItem {
  id: string;
  userId: string;
  url: string;
  title: string;
  description: string;
  thumbnail: string;
  favicon: string;
  tags: string[];
  note: string;
  collectionId: string;
  savedAt: any;
  lastVisitedAt: any;
  isRead: boolean;
}

export function useLinks(collectionId?: string) {
  const { user } = useAuth();
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLinks([]);
      setLoading(false);
      return;
    }

    let q = query(
      collection(db, 'users', user.uid, 'links'),
      orderBy('savedAt', 'desc')
    );

    if (collectionId && collectionId !== 'all') {
      q = query(
        collection(db, 'users', user.uid, 'links'),
        where('collectionId', '==', collectionId),
        orderBy('savedAt', 'desc')
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as LinkItem[];
      setLinks(data);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching links:", error);
      setLoading(false);
    });

    return unsubscribe;
  }, [user, collectionId]);

  const addLink = async (linkData: Partial<LinkItem>) => {
    if (!user) return;
    const docRef = await addDoc(collection(db, 'users', user.uid, 'links'), {
      ...linkData,
      userId: user.uid,
      savedAt: serverTimestamp(),
      lastVisitedAt: null,
      isRead: false
    });
    
    // Update link count in collection
    if (linkData.collectionId && linkData.collectionId !== 'uncategorized') {
      await updateDoc(doc(db, 'users', user.uid, 'collections', linkData.collectionId), {
        linkCount: increment(1)
      });
    }
    
    return docRef;
  };

  const markAsVisited = async (id: string) => {
    if (!user) return;
    await updateDoc(doc(db, 'users', user.uid, 'links', id), {
      lastVisitedAt: serverTimestamp()
    });
  };

  const updateLink = async (id: string, data: Partial<LinkItem>) => {
    if (!user) return;
    const oldLink = links.find(l => l.id === id);
    await updateDoc(doc(db, 'users', user.uid, 'links', id), data);
    
    // Handle collection change in linkCount
    if (oldLink && data.collectionId && oldLink.collectionId !== data.collectionId) {
      if (oldLink.collectionId && oldLink.collectionId !== 'uncategorized') {
        await updateDoc(doc(db, 'users', user.uid, 'collections', oldLink.collectionId), {
          linkCount: increment(-1)
        });
      }
      if (data.collectionId !== 'uncategorized') {
        await updateDoc(doc(db, 'users', user.uid, 'collections', data.collectionId), {
          linkCount: increment(1)
        });
      }
    }
  };

  const deleteLink = async (id: string) => {
    if (!user) return;
    const linkToDelete = links.find(l => l.id === id);
    await deleteDoc(doc(db, 'users', user.uid, 'links', id));
    
    if (linkToDelete?.collectionId && linkToDelete.collectionId !== 'uncategorized') {
      await updateDoc(doc(db, 'users', user.uid, 'collections', linkToDelete.collectionId), {
        linkCount: increment(-1)
      });
    }
  };

  return { links, loading, addLink, markAsVisited, deleteLink, updateLink };
}
