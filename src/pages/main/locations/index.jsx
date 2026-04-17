import CustomButton from "@/components/common/button/Button";
import CustomInputText from "@/components/common/input/InputText";
import DataTable from "@/components/common/table/DataTable";
import {
  useGetLocations,
  useGetLocationsByOrigin,
  useGetLocationsWithSize,
  useGetLocationsWithinRadius,
} from "@/hooks";
import { useThemeStore, useToastStore } from "@/stores";
import { useMemo, useState } from "react";
import { Accordion, AccordionTab } from "../../../components/common/Accordion";

export default function LocationManager() {
  const showToast = useToastStore((state) => state.showToast);
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === "dark";

  const [inputOrigin, setInputOrigin] = useState("");
  const [inputSize, setInputSize] = useState("");
  const [inputRadius, setInputRadius] = useState("");

  const [originFilter, setOriginFilter] = useState("");
  const [sizeFilter, setSizeFilter] = useState("");
  const [radiusFilter, setRadiusFilter] = useState("");

  const handleSearch = () => {
    setOriginFilter(inputOrigin);
    setSizeFilter(inputSize);
    setRadiusFilter(inputRadius);
  };

  const handleResetSearch = () => {
    setInputOrigin("");
    setInputSize("");
    setInputRadius("");
    setOriginFilter("");
    setSizeFilter("");
    setRadiusFilter("");
  };

  const activeMode = useMemo(() => {
    if (originFilter && radiusFilter) return "RADIUS";
    if (originFilter) return "ORIGIN";
    if (sizeFilter) return "SIZE";
    return "ALL";
  }, [originFilter, radiusFilter, sizeFilter]);

  const { locations: allLocations, isLoading: loadAll, refetch: refAll, error: errAll } = 
    useGetLocations();
  
  const { locations: originLocations, isLoading: loadOrigin, refetch: refOrigin, error: errOrigin } = 
    useGetLocationsByOrigin(activeMode === "ORIGIN" ? originFilter : "");
    
  const { locations: sizeLocations, isLoading: loadSize, refetch: refSize, error: errSize } = 
    useGetLocationsWithSize(activeMode === "SIZE" ? sizeFilter : null);
    
  const { locations: radiusLocations, isLoading: loadRadius, refetch: refRadius, error: errRadius } = 
    useGetLocationsWithinRadius(activeMode === "RADIUS" ? radiusFilter : "", activeMode === "RADIUS" ? originFilter : "");

  const currentLocations = useMemo(() => {
    switch (activeMode) {
      case "ORIGIN": return originLocations || [];
      case "SIZE": return sizeLocations || [];
      case "RADIUS": return radiusLocations || [];
      case "ALL":
      default: return allLocations || [];
    }
  }, [activeMode, allLocations, originLocations, sizeLocations, radiusLocations]);

  const isLoading = 
    activeMode === "RADIUS" ? loadRadius : 
    activeMode === "ORIGIN" ? loadOrigin : 
    activeMode === "SIZE" ? loadSize : 
    loadAll;

  const currentError = 
    activeMode === "RADIUS" ? errRadius : 
    activeMode === "ORIGIN" ? errOrigin : 
    activeMode === "SIZE" ? errSize : 
    errAll;

  const handleRefetch = async () => {
    try {
      switch (activeMode) {
        case "ORIGIN": await refOrigin(); break;
        case "SIZE": await refSize(); break;
        case "RADIUS": await refRadius(); break;
        case "ALL":
        default: await refAll(); break;
      }
      showToast({ type: "success", title: "Thành công", message: "Đã cập nhật danh sách." });
    } catch (e) {
      showToast({ type: "error", title: "Lỗi", message: `Không thể tải lại danh sách. ${e}` });
    }
  };

  const columns = [
    { field: "id", header: "ID", width: "70px" },
    { field: "name", header: "Địa điểm" },
    { field: "longitude", header: "Kinh độ" },
    { field: "latitude", header: "Vĩ độ" },
    { field: "description", header: "Mô tả" },
  ];

  return (
    <div className="space-y-4">
      <div
        className={`rounded-2xl border p-4 shadow-sm ${
          isDark ? "border-[#2f2f2f] bg-[#1f1f1f]" : "border-gray-200 bg-white"
        }`}
      >
        <Accordion multiple className="mb-4" isOpen={true}>
          <AccordionTab
            header="Tìm kiếm"
            headerClassName={isDark ? "bg-[#202020] text-gray-100" : "bg-[#f8fbff]"}
            contentClassName={isDark ? "bg-[#171717]" : "bg-white"}
          >
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <CustomInputText
                  label="Origin (Điểm gốc / Khu vực)"
                  value={inputOrigin}
                  onChange={(e) => setInputOrigin(e.target.value)}
                  placeholder="VD: 6.2071641,-75.5720321"
                  isDark={isDark}
                  containerClassName="w-full"
                />
                
                <CustomInputText
                  label="Radius (Bán kính)"
                  type="number"
                  value={inputRadius}
                  onChange={(e) => setInputRadius(e.target.value)}
                  placeholder="VD: 10"
                  isDark={isDark}
                  containerClassName="w-full"
                />
                
                <CustomInputText
                  label="Size (Giới hạn số lượng)"
                  type="number"
                  value={inputSize}
                  onChange={(e) => setInputSize(e.target.value)}
                  placeholder="VD: 10"
                  isDark={isDark}
                  containerClassName="w-full"
                />
              </div>

              {/* Nút hành động + đếm kết quả */}
              <div className="flex items-center justify-between flex-wrap gap-3">
                <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                  Đang hiển thị {currentLocations.length} địa điểm
                </p>
                <div className="flex gap-2">
                  <CustomButton label="Tìm kiếm" icon="pi pi-search" severity="info" outlined onClick={handleSearch} />
                  <CustomButton label="Đặt lại" icon="pi pi-refresh" severity="secondary" outlined onClick={handleResetSearch} />
                </div>
              </div>
            </div>
          </AccordionTab>
        </Accordion>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <h2 className={`text-lg font-semibold ${isDark ? "text-gray-100" : "text-gray-800"}`}>
          Danh sách Location
        </h2>
        
        <div className="flex items-center gap-2">
          <CustomButton
            label="Tải lại"
            icon="pi pi-refresh"
            severity="info"
            outlined
            loading={isLoading}
            onClick={handleRefetch}
          />
        </div>
      </div>

      <div
        className={`space-y-4 rounded-2xl border p-4 shadow-sm ${
          isDark ? "border-[#2f2f2f] bg-[#1f1f1f]" : "border-gray-200 bg-white"
        }`}
      >
        {currentError ? (
          <div
            className={`rounded-lg border px-4 py-3 text-sm ${
              isDark
                ? "border-red-500/40 bg-red-950/30 text-red-300"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            Không thể tải danh sách Location. Lỗi: {currentError.message || "Network Error"}
          </div>
        ) : null}

        <DataTable
          data={currentLocations}
          columns={columns}
          rows={10}
          rowsPerPageOptions={[5, 10, 20]}
          emptyMessage={
             isLoading ? "Đang tải dữ liệu..." : "Không có dữ liệu Location phù hợp."
          }
        />
      </div>
    </div>
  );
}
