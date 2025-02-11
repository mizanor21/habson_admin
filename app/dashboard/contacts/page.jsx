export const revalidate = 10; // Revalidate every 10 second
import { Contact } from "@/app/lib/Contact/model";
import ContactImg from "@/app/ui/ContactImg/ContactImg";
import React from "react";

const Contacts = async () => {
  const res = await fetch("http://localhost:3000/api/contact-img", {
    next: { revalidate },
  });

  if (!res.ok) {
    // Handle API fetch errors
    console.error("Failed to fetch home data");
    return <div>Failed to load content</div>;
  }

  const contactImg = await res.json();

  return <div>
    <ContactImg data={contactImg} />
  </div>;
};

export default Contacts;
