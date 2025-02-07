import Blogs from "@/app/ui/Blogs/Blogs";
import { getBlogsData } from "@/app/ui/Blogs/getBlogsData";

export default async function DashboardBlogPage() {
  const blogs = await getBlogsData();

  return (
    <div>
      {blogs.length > 0 ? <Blogs blogs={blogs} /> : <p>No blogs found.</p>}
    </div>
  );
}
