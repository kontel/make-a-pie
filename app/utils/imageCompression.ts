export async function compressImage(
  file: File,
  maxWidthHeight = 800
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions while maintaining aspect ratio
        if (width > height) {
          if (width > maxWidthHeight) {
            height = Math.round((height * maxWidthHeight) / width);
            width = maxWidthHeight;
          }
        } else {
          if (height > maxWidthHeight) {
            width = Math.round((width * maxWidthHeight) / height);
            height = maxWidthHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        // Compress as JPEG with 0.8 quality
        const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.5);
        resolve(compressedDataUrl);
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
}
