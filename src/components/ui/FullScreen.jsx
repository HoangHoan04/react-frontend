import { useEffect, useState } from "react";
import CustomTooltipButton from "../common/button/TooltipButton";

const FullScreen = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

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
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  };

  return (
    <CustomTooltipButton
      outlined
      severity="secondary"
      icon={isFullscreen ? "pi pi-window-minimize" : "pi pi-window-maximize"}
      onClick={toggleFullscreen}
      tooltip={isFullscreen ? "Thoát toàn màn hình" : "Toàn màn hình"}
      tooltipPosition="bottom"
      size="small"
    />
  );
};

export default FullScreen;
