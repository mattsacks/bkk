import { useCallback, useState } from "react";

import request from "@/lib/request";

interface UsePost<T> {
  data: T | undefined;
  error: string | undefined;
  postRequest: (body?: Record<string, unknown>) => Promise<void>;
  isSubmitting: boolean;
}

function usePost<T>(
  endpoint: string,
  defaultBody?: Record<string, unknown>
): UsePost<T> {
  const [data, setData] = useState<T>();
  const [error, setError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const postRequest = useCallback(
    (body = defaultBody) => {
      setIsSubmitting(true);
      setData(undefined);
      setError(undefined);

      async function post() {
        try {
          const response = await request<T>(endpoint, {
            body,
            method: "POST"
          });
          setIsSubmitting(false);
          setData(response);
        } catch (err) {
          setIsSubmitting(false);

          let errorMessage = err as string;
          if (err instanceof Error) {
            errorMessage = err.message;
          }
          setError(errorMessage);
        }
      }

      return post();
    },
    [defaultBody, endpoint]
  );

  return { data, error, postRequest, isSubmitting };
}

export default usePost;
