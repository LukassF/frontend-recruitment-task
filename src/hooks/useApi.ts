import { useState, useCallback } from "react";

export function useApi<TResponse>(baseUrl: string = "http://localhost:3000") {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<TResponse | null>(null);
  // used internally to stop overlapping requests
  const [running, setRunning] = useState<boolean>(false);

  const run = useCallback(
    async <TBody = Record<string, unknown>>(
      endpoint: string,
      method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
      body?: TBody,
      handleLoadingState: boolean = true,
    ): Promise<TResponse | null> => {
      if (running) {
        return null;
      }

      setRunning(true);
      setError(null);
      if (handleLoadingState) {
        setLoading(true);
      }
      try {
        const options: RequestInit = {
          method,
          headers: { "Content-Type": "application/json" },
        };

        if (body) {
          options.body = JSON.stringify(body);
        }

        const res = await fetch(`${baseUrl}${endpoint}`, options);
        const text = await res.text();
        const result = text ? JSON.parse(text) : null;

        if (!res.ok) {
          throw new Error(result?.message || res.statusText);
        }

        setData(result);
        return result;
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        }
        throw err;
      } finally {
        if (handleLoadingState) {
          setLoading(false);
        }
        setRunning(false);
      }
    },
    [baseUrl, running],
  );

  return { run, loading, error, data };
}
