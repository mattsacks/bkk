import { useCallback, useState } from "react";
import request from "lib/request";

interface UsePost<T> {
  data: T;
  error: string | null;
  postRequest: (body?: unknown) => Promise<void>;
  isSubmitting: boolean;
}

function usePost<T>(endpoint: string, defaultBody?: T): UsePost<T> {
  const [data, setData] = useState(undefined);
  const [error, setError] = useState(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const postRequest = useCallback((body = defaultBody) => {
    setIsSubmitting(true);
    setData(undefined);
    setError(undefined);

    async function post() {
      try {
        const response = await request(endpoint, {
          body,
          method: "POST"
        });
        setIsSubmitting(false);
        setData(response);
      } catch (err) {
        setIsSubmitting(false);
        setError(err instanceof Error ? err.message : err.toString());
      }
    }

    return post();
  }, []);

  return { data, error, postRequest, isSubmitting };
}

export default usePost;
