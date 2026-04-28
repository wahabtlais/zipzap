"use client";
import ImagePlaceholder from "@/shared/components/image-placeholder";
import { ChevronRight, Loader2, Wand, X } from "lucide-react";
import React, { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Input from "../../../../../../../packages/components/input";
import ColorSelector from "../../../../../../../packages/components/colorSelector";
import CustomSpecifications from "../../../../../../../packages/components/customSpecifications";
import CustomProperties from "../../../../../../../packages/components/customProperties";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosInstance";
import RichTextEditor from "../../../../../../../packages/components/rich-text-editor";
import SizeSelector from "../../../../../../../packages/components/sizeSelector";
import { enhancements } from "@/utils/ai.enhancements";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface UploadedImage {
  fileId: string;
  file_url: string;
}

const normalizeImageSlots = (imageSlots: (UploadedImage | null)[]) => {
  const uploadedImages = imageSlots.filter(
    (image): image is UploadedImage => image !== null,
  );

  return uploadedImages.length < 8 ? [...uploadedImages, null] : uploadedImages;
};

const CreateProduct = () => {
  const {
    register,
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [openImageModal, setOpenImageModal] = useState(false);
  const [isChanged] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  const [pictureUploadingLoader, setPictureUploadingLoader] = useState(false);
  const [images, setImages] = useState<(UploadedImage | null)[]>([null]);
  const [loading, setLoading] = useState(false);
  const [activeEffect, setActiveEffect] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [previewImageLoading, setPreviewImageLoading] = useState(false);
  const [originalImage, setOriginalImage] = useState<string | null>(null);

  const router = useRouter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/product/api/get-categories");
        return res.data;
      } catch (error) {
        console.log(errors);
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  const { data: discountCodes = [], isLoading: discountLoading } = useQuery({
    queryKey: ["shop-discounts"],
    queryFn: async () => {
      const res = await axiosInstance.get("/product/api/get-discount-codes");
      return res?.data?.discount_codes || [];
    },
  });

  const categories = data?.categories || [];
  const subCategoriesData = data?.subCategories || {};

  const selectedCategory = watch("category");
  const regularPrice = watch("regular_price");

  const subCategories = useMemo(() => {
    return selectedCategory ? subCategoriesData[selectedCategory] || [] : [];
  }, [selectedCategory, subCategoriesData]);

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      await axiosInstance.post("/product/api/create-product", data);
      router.push("/dashboard/all-products");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  const convertFileToBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageChange = async (file: File | null, index: number) => {
    if (!file) return;
    setPictureUploadingLoader(true);

    try {
      const fileName = await convertFileToBase64(file);
      const response = await axiosInstance.post(
        "/product/api/upload-product-image",
        { fileName },
      );

      const uploadedImages: UploadedImage = {
        fileId: response.data.fileId,
        file_url: response.data.file_url,
      };

      const updatedImages = normalizeImageSlots(
        images.map((image, imageIndex) =>
          imageIndex === index ? uploadedImages : image,
        ),
      );

      setImages(updatedImages);
      setValue("images", updatedImages);
      handleImageSelect(uploadedImages.file_url);
    } catch (error) {
      console.log(error);
    } finally {
      setPictureUploadingLoader(false);
    }
  };

  const handleRemoveImage = async (index: number) => {
    try {
      const imageToDelete = images[index];

      if (imageToDelete && typeof imageToDelete === "object") {
        await axiosInstance.delete("/product/api/delete-product-image", {
          data: {
            fileId: imageToDelete.fileId!,
          },
        });
      }

      const updatedImages = normalizeImageSlots(
        images.filter((_, imageIndex) => imageIndex !== index),
      );

      setImages(updatedImages);
      setValue("images", updatedImages);

      if (imageToDelete?.file_url === originalImage) {
        setOriginalImage(null);
        setSelectedImage("");
        setActiveEffect(null);
        setOpenImageModal(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleImageSelect = (url: string) => {
    setOriginalImage(url);
    setSelectedImage(url);
    setActiveEffect(null);
    setPreviewImageLoading(false);
  };

  const applyTransformation = async (transformation: string) => {
    if (!selectedImage || processing) return;

    if (activeEffect === transformation) {
      setProcessing(true);
      setPreviewImageLoading(true);
      setSelectedImage(originalImage!);
      setActiveEffect(null);
      return;
    }
    setProcessing(true);
    setPreviewImageLoading(true);
    setActiveEffect(transformation);

    try {
      const transformedUrl = `${originalImage}?tr=${transformation}`;
      setSelectedImage(transformedUrl);
    } catch (error) {
      console.log(error);
      setProcessing(false);
    }
  };

  const resetTransformation = () => {
    setProcessing(true);
    setPreviewImageLoading(true);
    setSelectedImage(originalImage!);
    setActiveEffect(null);
  };

  const handleSaveDraft = () => {};

  return (
    <form
      className="w-full mx-auto p-8 shadow-md rounded-lg text-white"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Heading & Breadcrumbs */}
      <h2 className="text-2xl py-2 font-semibold font-Poppins text-white">
        Create Product
      </h2>
      <div className="flex items-center">
        <span className="text-[#80deea] cursor-pointer">Dashboard</span>
        <ChevronRight className="opacity-[.8]" />
        <span>Create Product</span>
      </div>

      {/* Content Layout */}
      <div className="py-4 w-full flex gap-6">
        {/* Left side - Image upload section */}
        <div className="md:w-[35%]">
          {images?.length > 0 && (
            <ImagePlaceholder
              setOpenImageModal={setOpenImageModal}
              size="765 x 850"
              small={false}
              images={images}
              pictureUploadingLoader={pictureUploadingLoader}
              index={0}
              onImageChange={handleImageChange}
              setSelectedImage={handleImageSelect}
              onRemove={handleRemoveImage}
            />
          )}
          <div className="grid grid-cols-2 gap-3 mt-4">
            {images?.slice(1).map((_, index) => (
              <ImagePlaceholder
                setOpenImageModal={setOpenImageModal}
                size="765 x 850"
                small={true}
                images={images}
                pictureUploadingLoader={pictureUploadingLoader}
                key={index}
                index={index + 1}
                onImageChange={handleImageChange}
                setSelectedImage={handleImageSelect}
                onRemove={handleRemoveImage}
              />
            ))}
          </div>
        </div>
        {/* Right side - form inputs */}
        <div className="md:w-[65%]">
          <div className="mt-6 flex gap-6">
            {/* Product Title Input */}
            <div className="w-2/4">
              <Input
                label="Product Title *"
                placeholder="Enter product title"
                {...register("title", { required: "Title is required" })}
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.title.message as string}
                </p>
              )}

              <div className="mt-2">
                <Input
                  type="textarea"
                  rows={7}
                  cols={10}
                  label="Short Description * (Max 150 words)"
                  placeholder="Enter product description for quick view"
                  {...register("short_description", {
                    required: "Description is required",
                    validate: (value) => {
                      const wordCount = value.trim().split(/\s+/).length;
                      return (
                        wordCount <= 150 ||
                        "Description must be under 150 words (Currently " +
                          wordCount +
                          " words)."
                      );
                    },
                  })}
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.description.message as string}
                  </p>
                )}
              </div>

              <div className="mt-2">
                <Input
                  label="Tags *"
                  placeholder="apple, samsung, xiaomi"
                  {...register("tags", {
                    required: "Separate related product tags with commas",
                  })}
                />
                {errors.tags && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.tags.message as string}
                  </p>
                )}
              </div>

              <div className="mt-2">
                <Input
                  label="Warranty *"
                  placeholder="1 Year / No Warranty"
                  className="bg-transparent"
                  {...register("warranty", {
                    required: "Warranty is required!",
                  })}
                />
                {errors.warranty && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.warranty.message as string}
                  </p>
                )}
              </div>

              <div className="mt-2">
                <Input
                  label="Slug *"
                  placeholder="product-slug"
                  {...register("slug", {
                    required: "Slug is required!",
                    pattern: {
                      value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                      message:
                        "Invalid slug format. Use lowercase letters, numbers, and hyphens only.",
                    },
                    minLength: {
                      value: 3,
                      message: "Slug must be at least 3 characters long.",
                    },
                    maxLength: {
                      value: 50,
                      message: "Slug must be at most 50 characters long.",
                    },
                  })}
                />
                {errors.slug && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.slug.message as string}
                  </p>
                )}
              </div>

              <div className="mt-2">
                <Input
                  label="Brand"
                  placeholder="Ex: Apple"
                  {...register("brand")}
                />
                {errors.brand && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.brand.message as string}
                  </p>
                )}
              </div>

              <div className="mt-2">
                <ColorSelector control={control} errors={errors} />
              </div>
              <div className="mt-2">
                <CustomSpecifications control={control} errors={errors} />
              </div>
              <div className="mt-2">
                <CustomProperties control={control} errors={errors} />
              </div>
              <div className="mt-2">
                <label className="block font-semibold text-gray-300 mb-1">
                  Cash on Delivery Available *
                </label>
                <select
                  {...register("cash_on_delivery", {
                    required: "Cash on Delivery is required",
                  })}
                  defaultValue="yes"
                  className="w-full border outline border-gray-700 bg-transparent p-1 rounded-md text-white"
                >
                  <option value="yes" className="bg-black">
                    Yes
                  </option>
                  <option value="no" className="bg-black">
                    No
                  </option>
                </select>
                {errors.cash_on_delivery && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.cash_on_delivery.message as string}
                  </p>
                )}
              </div>
            </div>
            <div className="w-2/4">
              <label className="block font-semibold text-gray-300 mb-1">
                Category *
              </label>
              {isLoading ? (
                <p className="text-gray-400">Loading categories...</p>
              ) : isError ? (
                <p className="text-red-500">Failed to load categories</p>
              ) : (
                <Controller
                  name="category"
                  control={control}
                  rules={{ required: "Category is required" }}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full border outline-none border-gray-700 bg-transparent p-1 rounded-md text-white"
                    >
                      <option value="" className="bg-gray-800">
                        Select a category
                      </option>
                      {categories.map((category: string) => (
                        <option
                          key={category}
                          value={category}
                          className="bg-gray-800"
                        >
                          {category}
                        </option>
                      ))}
                    </select>
                  )}
                />
              )}
              {errors.category && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.category.message as string}
                </p>
              )}

              <div className="mt-2">
                <label className="block font-semibold text-gray-300 mb-1">
                  Subcategory*
                </label>
                <Controller
                  name="subCategory"
                  control={control}
                  rules={{ required: "Subcategory is required" }}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full border outline-none border-gray-700 bg-transparent p-1 rounded-md text-white"
                    >
                      <option value="" className="bg-black">
                        Select Subcategory
                      </option>
                      {subCategories?.map((subcategory: string) => (
                        <option
                          value={subcategory}
                          key={subcategory}
                          className="bg-black"
                        >
                          {subcategory}
                        </option>
                      ))}
                    </select>
                  )}
                />
                {errors.subcategory && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.subcategory.message as string}
                  </p>
                )}
              </div>

              <div className="mt-2">
                <label className="block font-semibold text-gray-300 mb-1">
                  Detailed Description * (Min 100 words)
                </label>
                <Controller
                  name="detailed_description"
                  control={control}
                  rules={{
                    required: "Detailed description is required!",
                    validate: (value) => {
                      const wordCount = value
                        ?.split(/|s+/)
                        .filter((word: string) => word).length;
                      return (
                        wordCount >= 100 ||
                        "Detailed description must be at least 100 words (Currently " +
                          wordCount +
                          " words)."
                      );
                    },
                  }}
                  render={({ field }) => (
                    <RichTextEditor
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                {errors.detailed_description && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.detailed_description.message as string}
                  </p>
                )}
              </div>

              <div className="mt-2">
                <Input
                  label="Video URL"
                  placeholder="https://www.youtube.com/embed/xyz123"
                  {...register("video_url", {
                    pattern: {
                      value:
                        /^https:\/\/(www\.)?youtube\.com\/embed\/[a-zA-Z0-9_-]+$/,
                      message: "Please enter a valid YouTube embed URL.",
                    },
                  })}
                />
                {errors.video_url && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.video_url.message as string}
                  </p>
                )}
              </div>

              <div className="mt-2">
                <Input
                  label="Regular Price"
                  placeholder="$20"
                  {...register("regular_price", {
                    valueAsNumber: true,
                    min: { value: 0, message: "Price must be at least $0" },
                    validate: (value) =>
                      !isNaN(value) || "Only numeric values are allowed",
                  })}
                />
                {errors.regular_price && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.regular_price.message as string}
                  </p>
                )}
              </div>

              <div className="mt-2">
                <Input
                  label="Sales Price *"
                  placeholder="$15"
                  {...register("sale_price", {
                    required: "Sales price is required",
                    valueAsNumber: true,
                    min: { value: 0, message: "Price must be at least $0" },
                    validate: (value) => {
                      if (isNaN(value))
                        return "Only numeric values are allowed";
                      if (regularPrice && value >= regularPrice)
                        return "Sales price must be less than regular price";
                      return true;
                    },
                  })}
                />
                {errors.sale_price && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.sale_price.message as string}
                  </p>
                )}
              </div>

              <div className="mt-2">
                <Input
                  label="Stock *"
                  placeholder="100"
                  {...register("stock", {
                    required: "Stock is required",
                    valueAsNumber: true,
                    min: { value: 1, message: "Stock must be at least 1" },
                    max: {
                      value: 10000,
                      message: "Stock cannot exceed 10,000",
                    },
                    validate: (value) => {
                      if (isNaN(value))
                        return "Only numeric values are allowed";
                      if (!Number.isInteger(value))
                        return "Stock must be an integer";
                      return true;
                    },
                  })}
                />
                {errors.stock && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.stock.message as string}
                  </p>
                )}
              </div>

              <div className="mt-2">
                <SizeSelector control={control} errors={errors} />
              </div>

              <div className="mt-3">
                <label className="block font-semibold text-gray-300 mb-1">
                  Select Discount Codes (optional)
                </label>
                {discountLoading ? (
                  <p className="text-gray-400">Loading discount codes...</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {discountCodes?.map((code: any) => (
                      <button
                        key={code.id}
                        type="button"
                        className={`px-3 py-1 rounded-md text-sm font-semibold border ${
                          watch("discountCodes")?.includes(code.id)
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700"
                        }`}
                        onClick={() => {
                          const currentSelection = watch("discountCodes") || [];
                          const updatedSelection = currentSelection?.includes(
                            code.id,
                          )
                            ? currentSelection.filter(
                                (id: string) => id !== code.id,
                              )
                            : [...currentSelection, code.id];
                          setValue("discountCodes", updatedSelection);
                        }}
                      >
                        {code?.public_name} ({code.discountValue}
                        {code.discountType === "percentage" ? "%" : "$"})
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {openImageModal && (
        <div className="fixed top-0 left-0 w-full flex items-center justify-center bg-black bg-opacity-50 h-full z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-[450px] text-white ">
            <div className="flex justify-between items-center pb-3 mb-4">
              <h2 className="text-lg font-semibold">Enhance Product Image</h2>
              <X
                size={20}
                className="cursor-pointer"
                onClick={() => setOpenImageModal(!openImageModal)}
              />
            </div>
            <div className="relative w-full h-[250px] rounded-md overflow-hidden border border-gray-600">
              <img
                src={selectedImage}
                alt="Selected image"
                onLoad={() => {
                  setPreviewImageLoading(false);
                  setProcessing(false);
                }}
                onError={() => {
                  setPreviewImageLoading(false);
                  setProcessing(false);
                }}
                className={`w-full h-full object-cover transition-opacity duration-200 ${
                  previewImageLoading ? "opacity-40" : "opacity-100"
                }`}
              />
              {previewImageLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/45 text-white">
                  <Loader2 size={28} className="animate-spin text-blue-400" />
                  <span className="mt-3 text-sm font-medium">
                    Processing image...
                  </span>
                </div>
              )}
            </div>
            {selectedImage && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-white text-sm font-semibold">
                    AI Enhancement
                  </h3>
                  {activeEffect && (
                    <button
                      type="button"
                      onClick={resetTransformation}
                      className="text-xs text-gray-400 hover:text-white transition-all underline"
                      disabled={processing}
                    >
                      Reset to Original
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 max-h-[250px] overflow-y-auto">
                  {enhancements.map(({ label, effect }) => {
                    const isActive = activeEffect === effect;
                    const isDisabled =
                      processing || (activeEffect !== null && !isActive);

                    return (
                      <button
                        type="button"
                        key={effect}
                        className={`p-2 rounded-md flex items-center gap-2 transition-all
              ${
                isActive
                  ? "bg-blue-600 text-white"
                  : isDisabled
                    ? "bg-gray-800 text-gray-500 cursor-not-allowed opacity-50"
                    : "bg-gray-700 hover:bg-gray-600 text-white"
              }`}
                        onClick={() => applyTransformation(effect)}
                        disabled={isDisabled}
                      >
                        {processing && isActive ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <Wand size={18} />
                        )}
                        {isActive ? `✓ ${label}` : label}
                      </button>
                    );
                  })}
                </div>

                {activeEffect && (
                  <p className="text-xs text-gray-400 text-center">
                    Click the active effect again or "Reset" to remove it
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-6 flex justify-end gap-3">
        {isChanged && (
          <button
            type="button"
            onClick={handleSaveDraft}
            className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 disabled:bg-gray-500 transition-all"
          >
            Save Draft
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-500 transition-all"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Product"}
        </button>
      </div>
    </form>
  );
};

export default CreateProduct;
