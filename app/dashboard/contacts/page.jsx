export const revalidate = 10; // Revalidate every 10 second
import React from "react";

const Contacts = async () => {
  const res = await fetch("https://habson-admin.vercel.app/api/contact-img", {
    next: { revalidate },
  });

  if (!res.ok) {
    // Handle API fetch errors
    console.error("Failed to fetch home data");
    return <div>Failed to load content</div>;
  }

  const contactImg = await res.json();
  console.log(contactImg);
  return <div>contact! {contactImg.length}</div>;
};

export default Contacts;
