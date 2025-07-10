import React, { useState, useEffect } from 'react';
import { MdOutlineCloudDownload } from "react-icons/md";

const FileUploadButton = ({ onFileChange, kind, flag }) => {
  const [showed, setShowed] = useState(flag);
  const [error, setError] = useState('');

  useEffect(() => {
    setShowed(flag);
  }, [flag]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const fileType = selectedFile.type.split('/')[0];
      if (fileType === 'image') {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result;
          setShowed(base64String); // Preview
          onFileChange && onFileChange(base64String, kind); // Send to parent
        };
        reader.readAsDataURL(selectedFile);
        setError('');
      } else {
        setError('Please upload an image file only');
      }
    }
  };

  return (
    <div className='flex flex-col gap-3 items-start justify-start'>

      <input
        type="file"
        accept="image/*"
        id={`file-upload-${kind}`}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      <button
        className='w-[300px]  h-[60px]  border border-four rounded-[16px] flex justify-center items-center pl-5'
        onClick={() => document.getElementById(`file-upload-${kind}`).click()}
      >
        {!showed && <MdOutlineCloudDownload className='w-10 h-10 text-one' />}
        <div className='flex justify-center items-center w-[100px] md:w-[150px] gap-2 mt-2'>
          {showed ? (
            <img
              className='w-10 h-10 object-cover rounded'
              src={
                showed.startsWith('data:image') || showed.startsWith('http')
                  ? showed
                  : `data:image/jpeg;base64,${showed}`
              }
              alt="Preview"
            />
          ) : (
            <span className='text-gray-500 text-sm'>Upload pic for Card</span>
          )}
        </div>
      </button>

      {error && <div className='text-red-500 text-sm'>{error}</div>}
    </div>
  );
};

export default FileUploadButton;
