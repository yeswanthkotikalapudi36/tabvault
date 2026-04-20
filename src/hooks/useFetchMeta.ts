import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

interface LinkMetadata {
  title: string;
  description: string;
  thumbnail: string;
  favicon: string;
  domain: string;
  url: string;
}

export function useFetchMeta() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMeta = useCallback(async (url: string): Promise<LinkMetadata | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/metadata?url=${encodeURIComponent(url)}`);
      return response.data;
    } catch (err: any) {
      setError(err.message || "Failed to fetch metadata");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { fetchMeta, loading, error };
}
