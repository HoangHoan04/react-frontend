import { useLoadingStore,useToastStore } from "@/stores";
import { useEffect, useState } from "react";
import rootApiService from "@/services/api.service";
import { API_ENDPOINTS } from "@/services/endpoint";
import DataTable from "../../../components/common/table/DataTable";
import CustomTooltipButton from "../../../components/common/button/TooltipButton";
import CustomButton from "../../../components/common/button/Button";
import Modal from "../../../components/ui/Modal";
import { Accordion, AccordionTab } from "../../../components/common/Accordion";
import FloatLabelInput from "../../../components/common/input/FloatLabelInput";
const Product_manager = () => {
  const showLoading = useLoadingStore((state) => state.showLoading);
  const hideLoading = useLoadingStore((state) => state.hideLoading);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isProductModalVisible, setIsProductModalVisible] = useState(false);
  const showToasts = useToastStore((state) => state.showToast);

  const filteredProducts = products.filter((product) => {
    const keyword = searchKeyword.trim().toLowerCase();
    if (!keyword) return true;

    const searchableText = [
      product.id,
      product.title,
      product.description,
      product.category?.name,
      product.price,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchableText.includes(keyword);
  });

  const openProductModal = (product) => {
    setSelectedProduct(product);
    setIsProductModalVisible(true);
  };

  const closeProductModal = () => {
    setIsProductModalVisible(false);
    setSelectedProduct(null);
  };

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
                openProductModal(rowData);
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
    openProductModal(rowData);
  };

  const modalFooter = (
    <div className="flex justify-end">
      <CustomButton
        label="Đóng"
        severity="secondary"
        onClick={closeProductModal}
      />
    </div>
  );

  return (
    <div>
      <Accordion defaultActiveIndex={1} className="mb-15">
        <AccordionTab header="Tìm kiếm">
          <FloatLabelInput
            label="Tìm kiếm theo ID, tên, mô tả, danh mục hoặc giá"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="mt-5 max-w-md"
          />
        </AccordionTab>
      </Accordion>

      <DataTable
        data={filteredProducts}
        columns={columns}
        paginator={true}
        rows={10}
        rowsPerPageOptions={[5, 10, 20, 50]}
        sortable={true}
        hoverable={true}
        onRowClick={handleRowClick}
        emptyMessage="Không có sản phẩm nào"
      />

      <Modal
        visible={isProductModalVisible}
        onClose={closeProductModal}
        title="Chi tiết sản phẩm"
        size="lg"
        footer={modalFooter}
      >
        {selectedProduct ? (
          <div className="grid gap-5 md:grid-cols-[220px_1fr]">
            <img
              src={selectedProduct.images?.[0] || "/default-image.png"}
              alt={selectedProduct.title}
              className="h-56 w-full rounded-lg border border-gray-200 object-cover"
            />

            <div className="space-y-3 text-sm">
              <p>
                <span className="font-medium">ID:</span>{" "}
                {selectedProduct.id}
              </p>
              <p>
                <span className="font-medium">Tên:</span>{" "}
                {selectedProduct.title}
              </p>
              <p>
                <span className="font-medium">Danh mục:</span>{" "}
                {selectedProduct.category?.name || "N/A"}
              </p>
              <p>
                <span className="font-medium">Giá:</span>{" "}
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(selectedProduct.price)}
              </p>
              <p className="leading-6">
                <span className="font-medium">Mô tả:</span>{" "}
                {selectedProduct.description || "Không có mô tả."}
              </p>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
};
export default Product_manager;
