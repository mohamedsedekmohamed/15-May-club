import React, { useState, useEffect } from "react";
import { MdOutlineCloudDownload, MdDeleteOutline } from "react-icons/md";

const FileUploadButtonArroy = ({ onFileChange, kind, flag }) => {
  const [showed, setShowed] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    setShowed(Array.isArray(flag) ? flag : []);
  }, [flag]);

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    const imageFiles = selectedFiles.filter(file =>
      file.type.startsWith("image/")
    );

    if (imageFiles.length === 0) {
      setError("Please upload image files only");
      return;
    }

    const remainingSlots = 5 - showed.length;
    if (remainingSlots <= 0) {
      setError("You can upload a maximum of 5 images");
      return;
    }

    const validImages = imageFiles.slice(0, remainingSlots);

    const readFileAsBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    };

    Promise.all(validImages.map(readFileAsBase64))
      .then((base64Images) => {
        const updated = [...showed, ...base64Images];
        setShowed(updated);
        onFileChange && onFileChange(updated, kind);
        setError("");
      })
      .catch(() => {
        setError("Error reading files");
      });
  };

  const handleDeleteImage = (indexToDelete) => {
    const updated = showed.filter((_, i) => i !== indexToDelete);
    setShowed(updated);
    onFileChange && onFileChange(updated, kind);
  };

  return (
    <div className="flex flex-col gap-2 items-start">
      <input
        type="file"
        accept="image/*"
        id={`file-upload-${kind}`}
        onChange={handleFileChange}
        multiple
        style={{ display: "none" }}
      />

      <button
        className="w-[300px] h-[60px] border border-four rounded-[16px] flex items-center gap-2 overflow-x-auto px-3"
        onClick={() => document.getElementById(`file-upload-${kind}`).click()}
        type="button"
      >
        {showed.length === 0 && (
          <>
            <MdOutlineCloudDownload className="w-7 h-7 text-one" />
            <span className="text-gray-500 text-sm">
              Upload pic(s) for Card
            </span>
          </>
        )}

        {showed.map((img, index) => (
          <div key={index} className="relative group">
           <img
  src={
    img.startsWith("http") || img.startsWith("/uploads")
      ? img.startsWith("/uploads")
        ? `https://app.15may.club${img}`
        : img
      : img
  }
  alt={`img-${index}`}
  className="w-10 h-10 object-cover rounded-md"
/>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteImage(index);
              }}
              className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-[2px] text-xs hover:bg-red-700"
              title="Delete"
            >
              <MdDeleteOutline size={12} />
            </button>
          </div>
        ))}
      </button>

      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
};

export default FileUploadButtonArroy;
