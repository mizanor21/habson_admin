import Image from "next/image";
import React from "react";
import { AiOutlineDelete } from "react-icons/ai";

const ContactImg = ({ data }) => {
  return (
    <div>
      <div className="mb-5">
        <h1 className="text-3xl font-bold uppercase">Contact Images</h1>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {data.map((item, index) => (
          <div key={index} className="relative group">
            <Image width={500} height={500} src={item.img} alt="contact" />
            <div className="absolute hidden  right-5 top-5 group-hover:flex">
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

export default ContactImg;
