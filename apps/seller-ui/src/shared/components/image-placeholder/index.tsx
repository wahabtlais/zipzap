import { Pencil, WandSparkles, X } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface UploadedImage {
  fileId: string;
  file_url: string;
}

const ImagePlaceholder = ({
  size,
  small,
  onImageChange,
  onRemove,
  defaultImage = null,
  index = null,
  setSelectedImage,
  pictureUploadingLoader,
  images,
  setOpenImageModal,
}: {
  size: string;
  small?: boolean;
  pictureUploadingLoader?: boolean;
  onImageChange: (file: File | null, index: number) => void;
  onRemove: (index: number) => void;
  defaultImage?: string | null;
  setSelectedImage: (image: string) => void;
  index?: any;
  images: (UploadedImage | null)[];
  setOpenImageModal: (openImageModal: boolean) => void;
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(defaultImage);
  const uploadedImage = index !== null ? images[index] : null;
  const uploadedImageUrl = uploadedImage?.file_url || null;

  useEffect(() => {
    setImagePreview(uploadedImageUrl || defaultImage);
  }, [defaultImage, uploadedImageUrl]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      onImageChange(file, index!);
    }
  };

  return (
    <div
      className={`relative ${
        small ? "h-[180px]" : "h-[450px]"
      } w-full bg-[#1e1e1e] border border-gray-600 rounded-lg flex flex-col justify-center items-center`}
    >
      <input
        type="file"
        accept="image/*"
        className="hidden"
        id={`image-upload-${index}`}
        onChange={handleFileChange}
      />

      {imagePreview ? (
        <>
          <button
            type="button"
            disabled={pictureUploadingLoader}
            onClick={() => {
              setImagePreview(null);
              onRemove?.(index!);
            }}
            className="absolute top-3 right-3 p-2 !rounded bg-red-600 shadow-lg disabled:bg-red-400 cursor-pointer disabled:cursor-not-allowed "
          >
            <X size={16} />
          </button>
          <button
            type="button"
            disabled={pictureUploadingLoader}
            className="absolute top-3 right-[70px] p-2 !rounded bg-blue-500 shadow-lg cursor-pointer disabled:bg-blue-300 disabled:cursor-not-allowed"
            onClick={() => {
              if (!uploadedImageUrl) return;
              setOpenImageModal(true);
              setSelectedImage(uploadedImageUrl);
            }}
          >
            <WandSparkles size={16} />
          </button>
        </>
      ) : (
        <label
          htmlFor={`image-upload-${index}`}
          className="absolute top-3 right-3 p-2 !rounded bg-slate-700 shadow-lg cursor-pointer"
        >
          <Pencil size={16} />
        </label>
      )}

      {imagePreview ? (
        <Image
          width={400}
          height={300}
          src={imagePreview}
          alt="uploaded image"
          aria-disabled={pictureUploadingLoader}
          className="h-full w-full object-contain rounded-lg aria-disabled:opacity-60"
        />
      ) : (
        <>
          <p
            className={`text-gray-400 ${
              small ? "text-xl" : "text-4xl"
            } font-semibold`}
          >
            {size}
          </p>
          <p
            className={`text-gray-500 ${
              small ? "text-sm" : "text-lg"
            } pt-2 text-center`}
          >
            Please choose an image <br />
            according to the mentioned size.
          </p>
        </>
      )}
    </div>
  );
};

export default ImagePlaceholder;
