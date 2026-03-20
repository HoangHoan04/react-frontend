import { useToastStore } from "@/stores";
import { useEffect, useMemo, useRef, useState } from "react";
import { useUploadFile } from "../../hooks";
import CustomButton from "./button/Button";
import CustomModal from "./Modal";

const getUploadedImageUrl = (response) => {
  if (!response || typeof response !== "object") return "";

  return (
    response.location ||
    response.url ||
    response.secure_url ||
    response.path ||
    ""
  );
};

const getDisplayImageUrl = (rawUrl) => {
  if (!rawUrl || typeof rawUrl !== "string") return "";

  // Keep local object URL untouched for immediate preview.
  if (rawUrl.startsWith("blob:")) return rawUrl;

  try {
    const parsed = new URL(rawUrl);

    // In dev, route Escuela file URLs through Vite proxy to avoid cross-origin policy blocks.
    if (
      import.meta.env.DEV &&
      parsed.hostname === "api.escuelajs.co" &&
      parsed.pathname.startsWith("/api/v1/files/")
    ) {
      return `${parsed.pathname}${parsed.search}`;
    }

    return parsed.toString();
  } catch {
    // Supports already-proxied relative URLs like /api/v1/files/xxx.png.
    return rawUrl;
  }
};

const getFileNameFromUrl = (url) => {
  try {
    const parsed = new URL(url);
    const fileName = parsed.pathname.split("/").filter(Boolean).pop();
    return fileName || "image-download";
  } catch {
    return "image-download";
  }
};

export default function CustomFileUpload({
  value = "",
  onChange,
  label = "Ảnh",
  emptyText = "Không có ảnh",
  accept = "image/*",
  disabled = false,
  isDark = false,
  className = "",
  previewTitle = "Xem chi tiết ảnh",
}) {
  const inputRef = useRef(null);
  const showToast = useToastStore((state) => state.showToast);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewObjectUrl, setPreviewObjectUrl] = useState("");

  const { mutateAsync: uploadFile, isPending: isUploading } = useUploadFile();

  const imageUrl = useMemo(
    () => value || previewObjectUrl || "",
    [value, previewObjectUrl],
  );
  const displayImageUrl = useMemo(
    () => getDisplayImageUrl(imageUrl),
    [imageUrl],
  );

  useEffect(() => {
    return () => {
      if (previewObjectUrl) {
        URL.revokeObjectURL(previewObjectUrl);
      }
    };
  }, [previewObjectUrl]);

  const openFilePicker = () => {
    if (disabled || isUploading) return;
    inputRef.current?.click();
  };

  const handleDownload = async () => {
    if (!imageUrl) return;

    const downloadUrl = displayImageUrl || imageUrl;

    const fileName = getFileNameFromUrl(imageUrl);

    try {
      const response = await fetch(downloadUrl);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);
    } catch {
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = fileName;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    setPreviewObjectUrl(localUrl);

    try {
      const response = await uploadFile(file);
      const uploadedUrl = getUploadedImageUrl(response);

      if (!uploadedUrl) {
        throw new Error("Upload thanh cong nhung khong nhan duoc URL anh");
      }

      setPreviewObjectUrl("");
      URL.revokeObjectURL(localUrl);
      onChange?.(uploadedUrl, response);

      showToast({
        type: "success",
        title: "Tải ảnh thành công",
        message: "Ảnh đã được tải lên và lưu lại.",
      });
    } catch {
      onChange?.("", null);
      showToast({
        type: "error",
        title: "Tải ảnh thất bại",
        message: "Không thể tải ảnh lên. Vui lòng thử lại.",
      });
    } finally {
      event.target.value = "";
    }
  };

  const handleRemove = () => {
    if (disabled || isUploading) return;
    setPreviewObjectUrl("");
    onChange?.("", null);
  };

  return (
    <div className={`space-y-2 ${className}`.trim()}>
      {label ? (
        <label
          className={`block text-sm font-medium ${
            isDark ? "text-gray-300" : "text-gray-700"
          }`}
        >
          {label}
        </label>
      ) : null}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled || isUploading}
      />

      <div
        className={`relative rounded-xl border overflow-hidden ${
          isDark ? "border-[#333] bg-[#111]" : "border-gray-200 bg-gray-50"
        } ${disabled ? "opacity-70" : ""}`}
      >
        {imageUrl ? (
          <div className="group relative">
            <img
              src={displayImageUrl || imageUrl}
              alt="Uploaded preview"
              className="h-52 w-full object-cover"
            />

            <div className="absolute inset-0 bg-black/45 opacity-0 transition-opacity duration-200 group-hover:opacity-100 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setIsPreviewOpen(true)}
                className="h-9 w-9 rounded-md bg-white/20 hover:bg-white/40 text-white inline-flex items-center justify-center"
                title="Xem chi tiết"
                aria-label="Xem chi tiết"
                disabled={disabled || isUploading}
              >
                <i className="pi pi-eye" />
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="h-9 w-9 rounded-md bg-white/20 hover:bg-white/40 text-white inline-flex items-center justify-center"
                title="Tải xuống"
                aria-label="Tải xuống"
                disabled={disabled || isUploading}
              >
                <i className="pi pi-download" />
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="h-9 w-9 rounded-md bg-red-500/60 hover:bg-red-500/80 text-white inline-flex items-center justify-center"
                title="Xóa ảnh"
                aria-label="Xóa ảnh"
                disabled={disabled || isUploading}
              >
                <i className="pi pi-trash" />
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={openFilePicker}
            className={`w-full h-52 px-4 inline-flex flex-col items-center justify-center gap-2 text-sm transition-colors ${
              disabled
                ? "cursor-not-allowed"
                : isDark
                  ? "hover:bg-white/5"
                  : "hover:bg-gray-100"
            }`}
            disabled={disabled || isUploading}
          >
            <i className="pi pi-image text-2xl opacity-70" />
            <span className="opacity-70">{emptyText}</span>
            <span className="text-xs opacity-60">
              Nhấn để chọn ảnh từ thiết bị
            </span>
          </button>
        )}

        {isUploading && (
          <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
            <span className="inline-flex items-center gap-2 rounded-md bg-black/60 text-white px-3 py-2 text-sm">
              <i className="pi pi-spin pi-spinner" />
              Đang tải ảnh...
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <CustomButton
          label={imageUrl ? "Đổi ảnh" : "Chọn ảnh"}
          icon="pi pi-upload"
          severity="info"
          outlined
          onClick={openFilePicker}
          disabled={disabled || isUploading}
        />
      </div>

      <CustomModal
        visible={isPreviewOpen}
        onHide={() => setIsPreviewOpen(false)}
        header={previewTitle}
        showHeader
        closeButton
        showFooter={Boolean(imageUrl)}
        isDark={isDark}
        modalWidth="max-w-5xl"
        footer={
          imageUrl ? (
            <CustomButton
              label="Tải xuống"
              icon="pi pi-download"
              severity="info"
              onClick={handleDownload}
            />
          ) : null
        }
        bodyClassName="flex items-center justify-center min-h-96"
      >
        {imageUrl ? (
          <img
            src={displayImageUrl || imageUrl}
            alt="Uploaded detail"
            className="max-h-96 max-w-full object-contain"
          />
        ) : (
          <p className="opacity-70">{emptyText}</p>
        )}
      </CustomModal>
    </div>
  );
}
