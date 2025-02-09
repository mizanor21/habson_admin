import React from "react";

const page = async () => {
  const revalidate = 60; // Define revalidate variable
  const res = await fetch(
    "https://habson-admin.vercel.app/api/mouse-movement",
    {
      next: { revalidate },
    }
  );

  if (!res.ok) {
    // Handle API fetch errors
    console.error("Failed to fetch home data");
    return <div>Failed to load content</div>;
  }

  const mouseMovementData = await res.json();
  return (
    <div>
      <div className="grid grid-cols-4 gap-5">
        {mouseMovementData.map((mouseMovement) => (
          <div key={mouseMovement._id} className="border p-10 text-center">
            <p>{mouseMovement.title}</p>
            <p>{mouseMovement.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default page;
