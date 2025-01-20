import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

export const useNewsItemsData = () => {
  const { data, error } = useSWR(
    "https://living-brands-admin.vercel.app/api/news-center",
    fetcher
  );
  return { data, error, isLoading: !data && !error };
};
