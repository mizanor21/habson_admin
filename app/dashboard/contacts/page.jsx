import Image from "next/image";
import React from "react";
import { AiOutlineDelete } from "react-icons/ai";
import ContactImageForm from "./ContactImageForm";

const Contacts = async () => {
  const res = await fetch("http://localhost:3000/api/contact-img", {
    next: { revalidate: 10 },
  });

  if (!res.ok) {
    console.error("Failed to fetch contact images");
    return <div>Failed to load content</div>;
  }

  const contactImg = await res.json();

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-3xl font-bold uppercase">Contact Images</h1>
      </div>
      <ContactImageForm />
      <div className="grid grid-cols-3 gap-3 mt-5">
        {contactImg.map((item, index) => (
          <div key={index} className="relative group">
            <Image width={500} height={500} src={item.img} alt="contact" />
            <div className="absolute hidden right-5 top-5 group-hover:flex">
              <button className="bg-white p-2 rounded-full hover:bg-red-500 hover:text-white transition-all duration-500">
                <AiOutlineDelete size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Contacts;