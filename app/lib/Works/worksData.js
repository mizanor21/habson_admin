"use client";
import Works from "@/app/ui/works/Works";
import axios from "axios";
import { useEffect, useState } from "react";

export default function WorksData() {
  const [state, setState] = useState({
    works: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchWorks = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/works`
        );
        setState({ works: response.data, loading: false, error: null });
      } catch (error) {
        console.error("Error fetching data:", error);
        setState({
          works: [],
          loading: false,
          error: "Failed to load works data.",
        });
      }
    };

    fetchWorks();
  }, []);

  const { works, loading, error } = state;

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      {works.length > 0 ? <Works works={works} /> : <p>No works found.</p>}
    </div>
  );
}
