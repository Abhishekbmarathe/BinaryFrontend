import React from 'react';

const WhatsAppSendButton = () => {
  return (
    <button className="flex items-center justify-center p-2 bg-[#25D366] rounded-full hover:bg-[#128C7E] transition duration-300">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="white"
        className="w-6 h-6"
      >
        <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
      </svg>
    </button>
  );
};

export default WhatsAppSendButton;
