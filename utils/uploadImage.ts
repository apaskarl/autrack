type UploadOptions = {
  uploadPreset: string;
  cloudName: string;
};

export const uploadImage = async (
  imageUri: string,
  options: UploadOptions
): Promise<string> => {
  const { uploadPreset, cloudName } = options;

  const formData = new FormData();
  formData.append("file", {
    uri: imageUri,
    type: "image/jpeg",
    name: `upload_${Date.now()}.jpg`,
  } as any);
  formData.append("upload_preset", uploadPreset);
  formData.append("cloud_name", cloudName);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || "Image upload failed");
  }

  return data.secure_url as string;
};
