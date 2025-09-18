import useSWR from "swr";

const fetcher = async (url) => {
  const response = await fetch(url);

  if (!response.ok) {
    const error = new Error("API se data fetch nahi ho paya");
    error.status = response.status;
    throw error;
  }

  return response.json();
};

export function usePatients() {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/patients/get-patient",
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: 30000,
      shouldRetryOnError: true,
      errorRetryInterval: 5000,
    }
  );

  return {
    patients: data?.items || [],
    loading: isLoading,
    error,
    refresh: mutate,
  };
}
