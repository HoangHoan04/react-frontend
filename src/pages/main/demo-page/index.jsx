import { useLoadingStore, useToastStore } from "@/stores";
import { useState } from "react";
import { Accordion, AccordionTab } from "../../../components/common/Accordion";
import CustomButton from "../../../components/common/button/Button";
import CustomRadioButton from "../../../components/common/button/RadioButton";
import CustomTooltipButton from "../../../components/common/button/TooltipButton";
import CustomDateInput from "../../../components/common/Calendar";
import FloatLabelInput from "../../../components/common/input/FloatLabelInput";
import CustomSelect from "../../../components/common/Select";
import DataTable from "../../../components/common/table/DataTable";
import CustomConfirmDialog from "../../../components/ui/ConfirmDialog";

export default function Dashboard() {
  const showLoading = useLoadingStore((state) => state.showLoading);
  const hideLoading = useLoadingStore((state) => state.hideLoading);
  const showToast = useToastStore((state) => state.showToast);
  const handleTestLoading = () => {
    showLoading();
    setTimeout(() => {
      hideLoading();
    }, 3000);
  };
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [birthDate, setBirthDate] = useState(null);
  const [eventTime, setEventTime] = useState(null);
  const [meetingTime, setMeetingTime] = useState(null);

  const [showConfirm, setShowConfirm] = useState(false);

  const [choice, setChoice] = useState("yes");

  // Dữ liệu mẫu cho DataTable
  const products = [
    {
      id: 1,
      name: "iPhone 15 Pro",
      category: "Điện thoại",
      price: 29990000,
      stock: 15,
      status: "Còn hàng",
    },
    {
      id: 2,
      name: "Samsung Galaxy S24",
      category: "Điện thoại",
      price: 25990000,
      stock: 23,
      status: "Còn hàng",
    },
    {
      id: 3,
      name: "MacBook Pro M3",
      category: "Laptop",
      price: 52990000,
      stock: 8,
      status: "Còn hàng",
    },
    {
      id: 4,
      name: "Dell XPS 15",
      category: "Laptop",
      price: 35990000,
      stock: 12,
      status: "Còn hàng",
    },
    {
      id: 5,
      name: "iPad Pro 12.9",
      category: "Máy tính bảng",
      price: 28990000,
      stock: 0,
      status: "Hết hàng",
    },
    {
      id: 6,
      name: "AirPods Pro 2",
      category: "Tai nghe",
      price: 6990000,
      stock: 45,
      status: "Còn hàng",
    },
    {
      id: 7,
      name: "Sony WH-1000XM5",
      category: "Tai nghe",
      price: 8990000,
      stock: 18,
      status: "Còn hàng",
    },
    {
      id: 8,
      name: "Apple Watch Series 9",
      category: "Đồng hồ",
      price: 10990000,
      stock: 25,
      status: "Còn hàng",
    },
    {
      id: 9,
      name: "Samsung Galaxy Watch 6",
      category: "Đồng hồ",
      price: 7990000,
      stock: 31,
      status: "Còn hàng",
    },
    {
      id: 10,
      name: "iPad Air",
      category: "Máy tính bảng",
      price: 16990000,
      stock: 14,
      status: "Còn hàng",
    },
    {
      id: 11,
      name: "Asus ROG Zephyrus",
      category: "Laptop",
      price: 42990000,
      stock: 6,
      status: "Còn hàng",
    },
    {
      id: 12,
      name: "Google Pixel 8 Pro",
      category: "Điện thoại",
      price: 23990000,
      stock: 19,
      status: "Còn hàng",
    },
    {
      id: 13,
      name: "Microsoft Surface Pro 9",
      category: "Laptop",
      price: 31990000,
      stock: 0,
      status: "Hết hàng",
    },
    {
      id: 14,
      name: "Xiaomi 14 Ultra",
      category: "Điện thoại",
      price: 24990000,
      stock: 27,
      status: "Còn hàng",
    },
    {
      id: 15,
      name: "HP Spectre x360",
      category: "Laptop",
      price: 38990000,
      stock: 9,
      status: "Còn hàng",
    },
    {
      id: 16,
      name: "Canon EOS R6",
      category: "Máy ảnh",
      price: 51990000,
      stock: 5,
      status: "Còn hàng",
    },
    {
      id: 17,
      name: "Sony A7 IV",
      category: "Máy ảnh",
      price: 56990000,
      stock: 4,
      status: "Còn hàng",
    },
    {
      id: 18,
      name: "DJI Mini 4 Pro",
      category: "Flycam",
      price: 21990000,
      stock: 11,
      status: "Còn hàng",
    },
    {
      id: 19,
      name: "GoPro Hero 12",
      category: "Máy ảnh",
      price: 12990000,
      stock: 22,
      status: "Còn hàng",
    },
    {
      id: 20,
      name: "Nintendo Switch OLED",
      category: "Game console",
      price: 9990000,
      stock: 33,
      status: "Còn hàng",
    },
    {
      id: 21,
      name: "PlayStation 5",
      category: "Game console",
      price: 14990000,
      stock: 0,
      status: "Hết hàng",
    },
    {
      id: 22,
      name: "Xbox Series X",
      category: "Game console",
      price: 13990000,
      stock: 17,
      status: "Còn hàng",
    },
    {
      id: 23,
      name: "Logitech MX Master 3S",
      category: "Phụ kiện",
      price: 2490000,
      stock: 42,
      status: "Còn hàng",
    },
    {
      id: 24,
      name: "Keychron K8 Pro",
      category: "Phụ kiện",
      price: 3290000,
      stock: 28,
      status: "Còn hàng",
    },
    {
      id: 25,
      name: "Samsung Odyssey G9",
      category: "Màn hình",
      price: 31990000,
      stock: 7,
      status: "Còn hàng",
    },
  ];

  // Cấu hình các cột cho DataTable
  const columns = [
    {
      field: "id",
      header: "ID",
      sortable: true,
      width: "80px",
    },
    {
      field: "name",
      header: "Tên sản phẩm",
      sortable: true,
    },
    {
      field: "category",
      header: "Danh mục",
      sortable: true,
    },
    {
      field: "price",
      header: "Giá bán",
      sortable: true,
      body: (rowData) => {
        return new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(rowData.price);
      },
    },
    {
      field: "stock",
      header: "Tồn kho",
      sortable: true,
      width: "100px",
      body: (rowData) => {
        return (
          <span
            className={`font-semibold ${
              rowData.stock === 0
                ? "text-red-600"
                : rowData.stock < 10
                  ? "text-orange-600"
                  : "text-green-600"
            }`}
          >
            {rowData.stock}
          </span>
        );
      },
    },
    {
      field: "status",
      header: "Trạng thái",
      sortable: true,
      width: "130px",
      body: (rowData) => {
        return (
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              rowData.status === "Còn hàng"
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
            }`}
          >
            {rowData.status}
          </span>
        );
      },
    },
    {
      field: "actions",
      header: "Thao tác",
      sortable: false,
      width: "150px",
      body: (rowData) => {
        return (
          <div className="flex gap-2">
            <CustomTooltipButton
              onClick={(e) => {
                e.stopPropagation();
                showToast({
                  type: "info",
                  title: "Xem chi tiết",
                  message: `Đang xem sản phẩm: ${rowData.name}`,
                });
              }}
              tooltip="Xem chi tiết"
              icon="pi pi-eye"
              size="small"
            />

            <CustomTooltipButton
              onClick={(e) => {
                e.stopPropagation();
                showToast({
                  type: "success",
                  title: "Chỉnh sửa",
                  message: `Đang chỉnh sửa: ${rowData.name}`,
                });
              }}
              tooltip="Sửa"
              icon="pi pi-pencil"
              severity="warning"
              size="small"
            />
            <CustomTooltipButton
              onClick={(e) => {
                e.stopPropagation();
                showToast({
                  type: "error",
                  title: "Xóa sản phẩm",
                  message: `Đã xóa: ${rowData.name}`,
                });
              }}
              tooltip="Xóa"
              icon="pi pi-trash"
              severity="danger"
              size="small"
            />
          </div>
        );
      },
    },
  ];

  // Xử lý click vào hàng
  const handleRowClick = (rowData) => {
    console.log("Clicked row:", rowData);
  };

  // State cho Select demo
  const [selectBottom, setSelectBottom] = useState(10);
  const [selectTop, setSelectTop] = useState(20);
  const [selectAuto, setSelectAuto] = useState(5);
  const selectOptions = [
    { label: "5 mục", value: 5 },
    { label: "10 mục", value: 10 },
    { label: "20 mục", value: 20 },
    { label: "50 mục", value: 50 },
    { label: "100 mục", value: 100 },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="max-w-md mx-auto p-6 space-y-6">
        <FloatLabelInput
          label="Họ và tên"
          value={name}
          onChange={(e) => setName(e.target.value)}
          icon="pi pi-user"
        />

        <FloatLabelInput
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon="pi pi-envelope"
        />
      </div>
      <button
        onClick={handleTestLoading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Test Loading (3 giây)
      </button>
      <div style={{ padding: "40px", fontFamily: "system-ui, sans-serif" }}>
        <h1 style={{ marginBottom: "24px" }}>Toast Component Demo</h1>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            maxWidth: "300px",
          }}
        >
          <button
            onClick={() =>
              showToast({
                type: "success",
                title: "Upload successful",
                message: "MyFinalPaper.pdf was uploaded successfully.",
                timeout: 5000,
              })
            }
            style={{
              padding: "12px 24px",
              backgroundColor: "#22C55E",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Show Success Toast
          </button>

          <button
            onClick={() =>
              showToast({
                type: "error",
                title: "Upload failed",
                message:
                  "Looks like you lost network connection. Please check it and try again.",
                timeout: 5000,
              })
            }
            style={{
              padding: "12px 24px",
              backgroundColor: "#EF4444",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Show Error Toast
          </button>

          <button
            onClick={() =>
              showToast({
                type: "warn",
                title: "Storage 75% full",
                message:
                  "Free up space or add more storage to continue syncing files.",
                timeout: 5000,
              })
            }
            style={{
              padding: "12px 24px",
              backgroundColor: "#F59E0B",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Show Warning Toast
          </button>

          <button
            onClick={() =>
              showToast({
                type: "info",
                title: "Update available",
                message: "A new software version is available for download.",
                timeout: 5000,
              })
            }
            style={{
              padding: "12px 24px",
              backgroundColor: "#3B82F6",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Show Info Toast
          </button>

          <button
            onClick={() => {
              showToast({
                type: "success",
                title: "First notification",
                message: "This is the first notification",
                timeout: 4000,
              });
              setTimeout(() => {
                showToast({
                  type: "error",
                  title: "Second notification",
                  message: "This is the second notification",
                  timeout: 4000,
                });
              }, 500);
              setTimeout(() => {
                showToast({
                  type: "warn",
                  title: "Third notification",
                  message: "This is the third notification",
                  timeout: 4000,
                });
              }, 1000);
            }}
            style={{
              padding: "12px 24px",
              backgroundColor: "#6366F1",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Show Multiple Toasts
          </button>
        </div>
      </div>
      <div className="py-12 px-6">
        <div className="max-w-lg mx-auto shadow-2xl rounded-2xl p-8 space-y-10">
          <h1 className="text-3xl font-bold text-center text-gray-800">
            Custom Date Picker dùng date-fns
          </h1>

          <div className="space-y-8">
            <div className="space-y-4">
              <CustomDateInput
                label="Ngày sinh"
                value={birthDate}
                onChange={setBirthDate}
                type="date"
              />
              <CustomDateInput
                label="Thời gian bắt đầu sự kiện"
                value={eventTime}
                onChange={setEventTime}
                type="datetime"
              />
              <CustomDateInput
                label="Giờ họp"
                value={meetingTime}
                onChange={setMeetingTime}
                type="time"
              />
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-xl text-sm text-blue-800 border border-blue-200">
            <strong>Hướng dẫn:</strong> Gõ <code>01/02/2024</code> → tự động
            parse thành ngày hợp lệ. Click icon lịch để chọn bằng popup.
          </div>
        </div>
      </div>
      <div className="max-w-3xl mx-auto ">
        <h1 className="text-2xl font-bold  text-center">
          Custom Accordion (PrimeReact style)
        </h1>

        {/* Ví dụ 1: Single mode (chỉ mở 1 tab) */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-3">Single Mode (default)</h2>
          <Accordion defaultActiveIndex={1}>
            <AccordionTab header="What is Tailwind CSS?">
              Tailwind CSS là một utility-first CSS framework giúp bạn xây dựng
              giao diện nhanh chóng mà không cần viết CSS tùy chỉnh quá nhiều.
            </AccordionTab>

            <AccordionTab header="PrimeIcons là gì?">
              PrimeIcons là bộ icon chính thức của PrimeReact/PrimeNG/PrimeVue,
              rất đẹp và dễ dùng với class <code>pi pi-xxx</code>.
            </AccordionTab>

            <AccordionTab header="Có hỗ trợ disabled không?" disabled>
              Có! Tab này bị disabled nên không click được.
            </AccordionTab>

            <AccordionTab header="Tab 4 - Disabled" disabled>
              Nội dung này không thể mở vì tab bị disabled.
            </AccordionTab>
          </Accordion>
        </div>

        {/* Ví dụ 2: Multiple mode */}
        <div>
          <h2 className="text-xl font-semibold mb-3">
            Multiple Mode (mở nhiều tab cùng lúc)
          </h2>
          <Accordion multiple defaultActiveIndex={0}>
            <AccordionTab header="Section A - Giới thiệu">
              <p className="text-gray-700">
                Đây là nội dung phần A. Bạn có thể mở nhiều phần cùng lúc khi
                dùng prop <code>multiple</code>.
              </p>
            </AccordionTab>

            <AccordionTab header="Section B - Tính năng">
              <ul className="list-disc pl-5 text-gray-700">
                <li>Transition mượt mà</li>
                <li>Hỗ trợ icon PrimeIcons</li>
                <li>Disabled tab</li>
                <li>Dễ tùy chỉnh bằng Tailwind</li>
              </ul>
            </AccordionTab>

            <AccordionTab header="Section C - Code ví dụ">
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                {`<Accordion multiple>
                    <AccordionTab header="Tiêu đề 1">...</AccordionTab>
                    <AccordionTab header="Tiêu đề 2">...</AccordionTab>
                  </Accordion>`}
              </pre>
            </AccordionTab>
          </Accordion>
        </div>
      </div>
      <CustomButton
        label="Xóa sản phẩm"
        onClick={() => setShowConfirm(true)}
        severity="danger"
        icon="pi pi-trash"
      />
      <CustomConfirmDialog
        visible={showConfirm}
        onHide={() => setShowConfirm(false)}
        header="Xác nhận xóa"
        message="Bạn thực sự muốn xóa sản phẩm này? Hành động này không thể hoàn tác."
        acceptLabel="Xóa ngay"
        rejectLabel="Hủy"
        icon="pi pi-trash"
        severity="danger"
        onAccept={() => {
          console.log("Đã xóa!");
        }}
        onReject={() => console.log("Đã hủy")}
      />
      <div className="flex flex-wrap gap-4 p-6">
        <CustomButton label="Primary" severity="primary" icon="pi pi-check" />
        <CustomButton
          label="Outlined"
          severity="primary"
          outlined
          icon="pi pi-user"
        />
        <CustomButton
          label="Success"
          severity="success"
          raised
          icon="pi pi-save"
        />
        <CustomButton
          label="Danger"
          severity="danger"
          icon="pi pi-trash"
          iconPos="right"
        />
        <CustomButton label="Loading..." severity="info" loading />
        <CustomButton
          label="Text Button"
          severity="help"
          text
          icon="pi pi-info-circle"
        />
        <CustomButton label="Rounded Pill" severity="warning" rounded />
        <CustomButton label="Disabled" disabled icon="pi pi-lock" />
      </div>
      <div className="p-6 space-y-4">
        <CustomRadioButton
          id="yes"
          name="agree"
          value="yes"
          checkedValue={choice}
          onChange={(e) => setChoice(e.target.value)}
          label="Đồng ý"
        />

        <CustomRadioButton
          id="no"
          name="agree"
          value="no"
          checkedValue={choice}
          onChange={(e) => setChoice(e.target.value)}
          label="Không đồng ý"
        />

        <CustomRadioButton
          id="disabled"
          name="agree"
          value="disabled"
          checkedValue={choice}
          onChange={() => {}}
          label="Disabled"
          disabled
        />

        <CustomRadioButton
          id="error"
          name="agree"
          value="error"
          checkedValue={choice}
          onChange={(e) => setChoice(e.target.value)}
          label="Có lỗi (invalid)"
          invalid
        />

        <p>Đang chọn: {choice}</p>
      </div>

      {/* TooltipButton Demo */}
      <div className="mt-10 p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Custom Tooltip Button
          </h2>
          <p className="text-gray-600">
            Button với tooltip đẹp mắt, nhiều size và variant
          </p>
        </div>

        <div className="space-y-8">
          {/* Icon Only Buttons - All Sizes */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-700">Icon Only (Sizes)</h3>
            <div className="flex items-center gap-3 flex-wrap">
              <CustomTooltipButton
                icon="pi pi-trash"
                tooltip="Xóa (Small)"
                severity="danger"
                size="small"
              />
              <CustomTooltipButton
                icon="pi pi-pencil"
                tooltip="Sửa (Default)"
                severity="info"
                size="default"
              />
              <CustomTooltipButton
                icon="pi pi-check"
                tooltip="Xác nhận (Large)"
                severity="success"
                size="large"
              />
            </div>
          </div>

          {/* Icon + Label Buttons - All Variants */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-700">
              Icon + Label (Variants)
            </h3>
            <div className="flex items-center gap-3 flex-wrap">
              <CustomTooltipButton
                icon="pi pi-save"
                label="Lưu"
                tooltip="Lưu dữ liệu"
                severity="primary"
                variant="default"
              />
              <CustomTooltipButton
                icon="pi pi-times"
                label="Hủy"
                tooltip="Hủy thao tác"
                severity="secondary"
                variant="outlined"
              />
              <CustomTooltipButton
                icon="pi pi-download"
                label="Tải xuống"
                tooltip="Tải file về máy"
                severity="info"
                variant="text"
              />
            </div>
          </div>

          {/* All Severities */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-700">
              All Severities (Outlined)
            </h3>
            <div className="flex items-center gap-3 flex-wrap">
              <CustomTooltipButton
                icon="pi pi-home"
                tooltip="Primary"
                severity="primary"
                variant="outlined"
              />
              <CustomTooltipButton
                icon="pi pi-cog"
                tooltip="Secondary"
                severity="secondary"
                variant="outlined"
              />
              <CustomTooltipButton
                icon="pi pi-check-circle"
                tooltip="Success"
                severity="success"
                variant="outlined"
              />
              <CustomTooltipButton
                icon="pi pi-info-circle"
                tooltip="Info"
                severity="info"
                variant="outlined"
              />
              <CustomTooltipButton
                icon="pi pi-exclamation-triangle"
                tooltip="Warning"
                severity="warning"
                variant="outlined"
              />
              <CustomTooltipButton
                icon="pi pi-times-circle"
                tooltip="Danger"
                severity="danger"
                variant="outlined"
              />
              <CustomTooltipButton
                icon="pi pi-question-circle"
                tooltip="Help"
                severity="help"
                variant="outlined"
              />
            </div>
          </div>

          {/* Tooltip Positions */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-700">Tooltip Positions</h3>
            <div className="flex items-center justify-center gap-8 py-12">
              <CustomTooltipButton
                icon="pi pi-arrow-up"
                tooltip="Tooltip Top"
                tooltipPosition="top"
                severity="primary"
              />
              <CustomTooltipButton
                icon="pi pi-arrow-down"
                tooltip="Tooltip Bottom"
                tooltipPosition="bottom"
                severity="success"
              />
              <CustomTooltipButton
                icon="pi pi-arrow-left"
                tooltip="Tooltip Left"
                tooltipPosition="left"
                severity="warning"
              />
              <CustomTooltipButton
                icon="pi pi-arrow-right"
                tooltip="Tooltip Right"
                tooltipPosition="right"
                severity="danger"
              />
            </div>
          </div>

          {/* Disabled State */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-700">Disabled State</h3>
            <div className="flex items-center gap-3 flex-wrap">
              <CustomTooltipButton
                icon="pi pi-lock"
                label="Disabled"
                tooltip="Button bị vô hiệu hóa"
                severity="primary"
                disabled
              />
              <CustomTooltipButton
                icon="pi pi-ban"
                tooltip="Không thể click"
                severity="danger"
                variant="outlined"
                disabled
              />
            </div>
          </div>
        </div>
      </div>

      {/* DataTable Example với Custom Pagination */}
      <div className="mt-10 p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Quản lý sản phẩm
          </h2>
          <p className="text-gray-600">
            Ví dụ sử dụng DataTable với Pagination tùy chỉnh
          </p>
        </div>

        <DataTable
          data={products}
          columns={columns}
          paginator={true}
          rows={10}
          rowsPerPageOptions={[5, 10, 20, 50]}
          sortable={true}
          hoverable={true}
          onRowClick={handleRowClick}
          emptyMessage="Không có sản phẩm nào"
        />
      </div>

      {/* Custom Select Demo */}
      <div className="mt-10 p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Custom Select Component
          </h2>
          <p className="text-gray-600">
            Dropdown với các vị trí hiển thị khác nhau (top, bottom, auto)
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Select Bottom */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-700">
              Position: Bottom (mặc định)
            </h3>
            <p className="text-sm text-gray-600">
              Menu luôn hiển thị phía dưới
            </p>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-700">Chọn:</span>
              <CustomSelect
                value={selectBottom}
                onChange={setSelectBottom}
                options={selectOptions}
                position="bottom"
              />
            </div>
            <p className="text-xs text-gray-500">
              Giá trị đã chọn: {selectBottom}
            </p>
          </div>

          {/* Select Top */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-700">Position: Top</h3>
            <p className="text-sm text-gray-600">
              Menu luôn hiển thị phía trên
            </p>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-700">Chọn:</span>
              <CustomSelect
                value={selectTop}
                onChange={setSelectTop}
                options={selectOptions}
                position="top"
              />
            </div>
            <p className="text-xs text-gray-500">
              Giá trị đã chọn: {selectTop}
            </p>
          </div>

          {/* Select Auto */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-700">Position: Auto</h3>
            <p className="text-sm text-gray-600">Tự động chọn vị trí phù hợp</p>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-700">Chọn:</span>
              <CustomSelect
                value={selectAuto}
                onChange={setSelectAuto}
                options={selectOptions}
                position="auto"
              />
            </div>
            <p className="text-xs text-gray-500">
              Giá trị đã chọn: {selectAuto}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
