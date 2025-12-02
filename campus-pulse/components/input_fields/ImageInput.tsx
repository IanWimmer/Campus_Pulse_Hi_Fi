"use client";

import ImagePlaceholderPlus from "@/public/icons/ImagePlaceholderPlus";
import clsx from "clsx";
import { useState, ChangeEvent } from "react";

const ImageInput = ({
  withPlaceholder = true,
  placeholder = "Select an image...",
  withIcon = true,
}: {
  withPlaceholder?: boolean;
  placeholder?: string | React.ReactNode;
  withIcon?: boolean;
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setImageSrc(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <label className="relative flex justify-center items-center w-full min-h-34 h-fit">
      <input type="file" accept="image/*" onChange={handleImageChange} className="sr-only" />
      {imageSrc ? (
        <img
          src={imageSrc}
          alt="Uploaded preview"
          className={clsx("object-cover max-h-60 w-full")}
        />
      ) : (
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center flex-col gap-2">
          <div className="bg-zinc-300 h-12 w-12 flex items-center justify-center">
            <ImagePlaceholderPlus className="h-6! w-6!"/>
          </div>
          {withPlaceholder && <p className="font-secondary text-placeholder text-sm">
            {placeholder}
          </p>}
        </div>
      )}
    </label>
  );
};

export default ImageInput;
