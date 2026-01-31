import "./assets/styles/index.css";
import TableCustom from "./components/ui/TableCustom";

function App() {
  // Sample data
  const sampleData = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      email: "nguyenvana@email.com",
      role: "Developer",
      status: "Đang hoạt động",
      salary: "25,000,000 ₫",
    },
    {
      id: 2,
      name: "Trần Thị B",
      email: "tranthib@email.com",
      role: "Designer",
      status: "Đang hoạt động",
      salary: "22,000,000 ₫",
    },
    {
      id: 3,
      name: "Lê Văn C",
      email: "levanc@email.com",
      role: "Manager",
      status: "Nghỉ phép",
      salary: "35,000,000 ₫",
    },
    {
      id: 4,
      name: "Phạm Thị D",
      email: "phamthid@email.com",
      role: "Developer",
      status: "Đang hoạt động",
      salary: "28,000,000 ₫",
    },
    {
      id: 5,
      name: "Hoàng Văn E",
      email: "hoangvane@email.com",
      role: "Tester",
      status: "Đang hoạt động",
      salary: "18,000,000 ₫",
    },
    {
      id: 6,
      name: "Vũ Thị F",
      email: "vuthif@email.com",
      role: "Developer",
      status: "Đang hoạt động",
      salary: "26,000,000 ₫",
    },
    {
      id: 7,
      name: "Đỗ Văn G",
      email: "dovang@email.com",
      role: "Designer",
      status: "Nghỉ phép",
      salary: "23,000,000 ₫",
    },
    {
      id: 8,
      name: "Bùi Thị H",
      email: "buithih@email.com",
      role: "Manager",
      status: "Đang hoạt động",
      salary: "40,000,000 ₫",
    },
    {
      id: 9,
      name: "Đinh Văn I",
      email: "dinhvani@email.com",
      role: "Developer",
      status: "Đang hoạt động",
      salary: "27,000,000 ₫",
    },
    {
      id: 10,
      name: "Ngô Thị K",
      email: "ngothik@email.com",
      role: "Tester",
      status: "Đang hoạt động",
      salary: "19,000,000 ₫",
    },
    {
      id: 11,
      name: "Dương Văn L",
      email: "duongvanl@email.com",
      role: "Developer",
      status: "Đang hoạt động",
      salary: "29,000,000 ₫",
    },
    {
      id: 12,
      name: "Lý Thị M",
      email: "lythim@email.com",
      role: "Designer",
      status: "Nghỉ phép",
      salary: "24,000,000 ₫",
    },
  ];

  // Column configuration
  const columns = [
    {
      key: "id",
      label: "ID",
      width: "80px",
    },
    {
      key: "name",
      label: "Họ và Tên",
      width: "200px",
    },
    {
      key: "email",
      label: "Email",
      width: "250px",
    },
    {
      key: "role",
      label: "Vai trò",
      width: "150px",
      render: (value) => (
        <span className={`badge badge-${value.toLowerCase()}`}>{value}</span>
      ),
    },
    {
      key: "status",
      label: "Trạng thái",
      width: "150px",
      render: (value) => (
        <span
          className={`status-badge ${value === "Đang hoạt động" ? "active" : "inactive"}`}
        >
          <span className="status-dot"></span>
          {value}
        </span>
      ),
    },
    {
      key: "salary",
      label: "Lương",
      width: "180px",
    },
  ];

  const handleRowClick = (row) => {
    console.log("Clicked row:", row);
    alert(`Bạn đã click vào: ${row.name}`);
  };

  return (
    <div className="app">
      <div className="app-header">
        <h1>Quản lý nhân viên</h1>
        <p>Custom Table Component với React + Vite</p>
      </div>

      <TableCustom
        data={sampleData}
        columns={columns}
        striped={true}
        hoverable={true}
        bordered={false}
        sortable={true}
        pagination={true}
        pageSize={5}
        onRowClick={handleRowClick}
      />
    </div>
  );
}

export default App;
