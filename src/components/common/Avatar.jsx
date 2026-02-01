import { useState } from "react";

export const Avatar = ({ image, className = "" }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className={`
        w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9
        rounded-full overflow-hidden
        border-2 border-[#1890ff]
        shadow-[0_2px_8px_rgba(24,144,255,0.2)]
        ${className}
      `}
    >
      {!imgError ? (
        <img
          src={image}
          alt="Avatar"
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="w-full h-full bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center">
          <i className="pi pi-user text-white text-[14px]" />
        </div>
      )}
    </div>
  );
};
