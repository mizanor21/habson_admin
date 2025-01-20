"use client";
import Blogs from "@/app/ui/Blogs/Blogs";
import { useEffect, useState } from "react";

export default function BlogsData() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/blogs`,
          {
            // Change endpoint to your blogs API
            cache: "no-store",
          }
        );
        const data = await response.json();
        setBlogs(data); // Assuming your API returns an array of blogs
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <Blogs blogs={blogs} /> Pass blogs instead of works
    </div>
  );
}
