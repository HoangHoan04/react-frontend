import { useLoading } from "@/context/LoadingContext";
import { useState } from "react";
import { Accordion, AccordionTab } from "../../../components/common/Accordion";
import CustomButton from "../../../components/common/button/Button";
import CustomRadioButton from "../../../components/common/button/RadioButton";
import TooltipButtonCustom from "../../../components/common/button/TooltipButton";
import CustomDateInput from "../../../components/common/Calendar";
import FloatLabelInput from "../../../components/common/input/FloatLabelInput";
import CustomConfirmDialog from "../../../components/ui/ConfirmDialog";
import { useToast } from "../../../context/ToastContext";

export default function Dashboard() {
  const { showLoading, hideLoading } = useLoading();
  const { showToast } = useToast();
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
      <div className="min-h-screen  py-12 px-6">
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
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">
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
      <button
        className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
        onClick={() => setShowConfirm(true)}
      >
        Xóa sản phẩm
      </button>
      <CustomConfirmDialog
        visible={showConfirm}
        onHide={() => setShowConfirm(false)}
        header="Xác nhận xóa"
        message="Bạn thực sự muốn xóa sản phẩm này?\nHành động này không thể hoàn tác."
        acceptLabel="Xóa ngay"
        rejectLabel="Hủy"
        icon="pi pi-trash"
        severity="success"
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

      <TooltipButtonCustom
        icon="pi pi-trash"
        tooltip="Xóa"
        severity="danger"
        variant="outlined"
      />
      <TooltipButtonCustom
        icon="pi pi-check"
        label="Xác nhận"
        tooltip="Hoàn tất"
        severity="success"
        variant="outlined"
        size="large"
      />
      <TooltipButtonCustom icon="pi pi-plus" label="Thêm" severity="primary" />
    </div>
  );
}
