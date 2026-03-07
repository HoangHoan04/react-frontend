import { useLoading } from "@/context/LoadingContext";
import { useEffect, useState } from "react";
import rootApiService from "@/services/api.service";
import { API_ENDPOINTS } from "@/services/endpoint";
import DataTable from "../../../components/common/table/DataTable";
import CustomTooltipButton from "../../../components/common/button/TooltipButton";
import { useToast } from "@/context/ToastContext";
const Product_manager = () => {
  const { showLoading, hideLoading } = useLoading();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const { showToast } = useToast();
  const columns = [
    {
      field: "id",
      header: "ID",
      sortable: true,
      width: "80px",
    },
    {
      field: "title",
      header: "Tên sản phẩm",
      sortable: true,
    },
    {
      field: "category",
      header: "Danh mục",
      sortable: true,
      body: (rowData) => rowData.category?.name || "N/A",
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
      field: "images",
      header: "Hình ảnh",
      width: "120px",
      body: (rowData) => {
        return (
          <img
            src={rowData.images?.[0] || "/default-image.png"}
            alt={rowData.title}
            className="w-16 h-16 object-cover rounded-md"
          />
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
                  message: `Đang xem sản phẩm: ${rowData.title}`,
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
                  message: `Đang chỉnh sửa: ${rowData.title}`,
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
                  message: `Đã xóa: ${rowData.title}`,
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
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        showLoading();
        const data = await rootApiService.get(API_ENDPOINTS.PRODUCT.LIST);
        setProducts(data);
        console.log("Fetched products:", data);
      } catch (error) {
        setError(error);
        console.error("Error fetching products:", error);
      } finally {
        hideLoading();
      }
    };
    fetchProducts();
  }, []);
  const handleRowClick = (rowData) => {
    showToast({
      type: "info",
      title: "Sản phẩm đã chọn",
      message: `Bạn đã chọn: ${rowData.title}`,
    });
  };
  return (
    <div className="p-6">
      <div className="mt-10 p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
          </h2>
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
    </div>
  );
};
export default Product_manager;
