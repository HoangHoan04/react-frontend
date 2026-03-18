import { useMemo, useState } from "react";
import CustomModal from "./Modal";

const DEFAULT_BLOCKED_IMAGE_HOSTS = new Set([
  "placeimg.com",
  "www.placeimg.com",
]);

export const getSafeImageUrl = (
  rawUrl,
  blockedHosts = DEFAULT_BLOCKED_IMAGE_HOSTS,
) => {
  if (!rawUrl || typeof rawUrl !== "string") return "";

  try {
    const parsedUrl = new URL(rawUrl);
    if (blockedHosts.has(parsedUrl.hostname.toLowerCase())) return "";
    return parsedUrl.toString();
  } catch {
    return "";
  }
};

const getDisplayImageUrl = (rawUrl) => {
  if (!rawUrl || typeof rawUrl !== "string") return "";

  if (rawUrl.startsWith("blob:")) return rawUrl;

  try {
    const parsed = new URL(rawUrl);
    if (
      import.meta.env.DEV &&
      parsed.hostname === "api.escuelajs.co" &&
      parsed.pathname.startsWith("/api/v1/files/")
    ) {
      return `${parsed.pathname}${parsed.search}`;
    }

    return parsed.toString();
  } catch {
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

export default function CustomImage({
  src,
  alt = "Image",
  emptyText = "Không có ảnh",
  blockedHosts = DEFAULT_BLOCKED_IMAGE_HOSTS,
  thumbnailClassName = "h-10 w-10 rounded-md object-cover",
  allowPreview = true,
  allowDownload = true,
  previewTitle,
}) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const safeImageUrl = useMemo(
    () => getSafeImageUrl(src, blockedHosts),
    [src, blockedHosts],
  );
  const displayImageUrl = useMemo(
    () => getDisplayImageUrl(safeImageUrl),
    [safeImageUrl],
  );

  const handleDownload = async () => {
    if (!safeImageUrl) return;

    const downloadUrl = displayImageUrl || safeImageUrl;
    const fileName = getFileNameFromUrl(safeImageUrl);

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

  if (!safeImageUrl) {
    return <span className="text-xs opacity-70">{emptyText}</span>;
  }

  return (
    <>
      <div
        className="relative inline-flex"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={displayImageUrl || safeImageUrl}
          alt={alt}
          className={`${thumbnailClassName}`.trim()}
        />

        {/* Overlay with icons */}
        {isHovered && (
          <div className="absolute inset-0 rounded-md bg-black/40 flex items-center justify-center gap-2">
            {allowPreview && (
              <button
                type="button"
                onClick={() => setIsPreviewOpen(true)}
                className="h-7 w-7 inline-flex items-center justify-center rounded-md bg-white/20 hover:bg-white/40 text-white transition-colors"
                title="Xem chi tiết"
                aria-label="Xem chi tiết"
              >
                <i className="pi pi-eye font-bold text-sm" />
              </button>
            )}
            {allowDownload && (
              <button
                type="button"
                onClick={handleDownload}
                className="h-7 w-7 inline-flex items-center justify-center rounded-md bg-white/20 hover:bg-white/40 text-white transition-colors"
                title="Tải xuống"
                aria-label="Tải xuống"
              >
                <i className="pi pi-download font-bold text-sm" />
              </button>
            )}
          </div>
        )}
      </div>

      <CustomModal
        visible={isPreviewOpen}
        onHide={() => setIsPreviewOpen(false)}
        header={previewTitle || alt}
        showHeader
        closeButton
        showFooter={allowDownload}
        modalWidth="max-w-5xl"
        isDark
        footer={
          allowDownload && (
            <button
              type="button"
              onClick={handleDownload}
              className="h-10 px-4 inline-flex items-center gap-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors"
            >
              <i className="pi pi-download" />
              <span className="text-sm">Tải xuống</span>
            </button>
          )
        }
        bodyClassName="flex items-center justify-center min-h-96"
      >
        <img
          src={displayImageUrl || safeImageUrl}
          alt={alt}
          className="max-h-96 max-w-full object-contain"
        />
      </CustomModal>
    </>
  );
}
