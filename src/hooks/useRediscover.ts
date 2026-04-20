import { useState, useCallback, useMemo } from 'react';
import { useLinks, LinkItem } from './useLinks';

export function useRediscover() {
  const { links, loading, markAsVisited } = useLinks();
  const [picks, setPicks] = useState<LinkItem[]>([]);

  const shuffle = useCallback(() => {
    if (links.length === 0) return;

    // Logic: lastVisitedAt is null OR > 7 days ago
    const candidates = links.filter(link => {
      if (!link.lastVisitedAt) return true;
      
      const lastVisited = link.lastVisitedAt.toDate();
      const now = new Date();
      const diffDays = (now.getTime() - lastVisited.getTime()) / (1000 * 3600 * 24);
      return diffDays > 7;
    });

    // If we have fewer than 3 candidates, just use what we have, or supplement from all links if needed
    const listToPickFrom = candidates.length >= 3 ? candidates : (links.length >= 3 ? links : candidates);

    const shuffled = [...listToPickFrom].sort(() => 0.5 - Math.random());
    setPicks(shuffled.slice(0, 3));
  }, [links]);

  // Initial shuffle once links are loaded
  useMemo(() => {
    if (!loading && links.length > 0 && picks.length === 0) {
      shuffle();
    }
  }, [loading, links.length, shuffle, picks.length]);

  return { picks, shuffle, loading, markAsVisited };
}
