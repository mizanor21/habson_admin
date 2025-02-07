export async function getBlogsData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch blogs data");
  }
  return res.json();
}
