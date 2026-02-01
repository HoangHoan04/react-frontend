import { useTheme } from "@/context/ThemeContext";
import { useEffect, useState } from "react";
import { IconButton } from "../common/IconButton";

const FullScreen = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error("Error toggling fullscreen:", error);
    }
  };

  return (
    <IconButton
      icon={isFullscreen ? "pi pi-window-minimize" : "pi pi-window-maximize"}
      onClick={toggleFullscreen}
      tooltip={isFullscreen ? "Thoát toàn màn hình" : "Toàn màn hình"}
      isDark={isDark}
      tooltipPosition="bottom"
    />
  );
};

export default FullScreen;
