import { useLoading } from "@/context/LoadingContext";
import { useEffect, useState } from "react";
import rootApiService from "@/services/api.service";
import { API_ENDPOINTS } from "@/services/endpoint";
import TableCustom from "@/components/ui/TableCustom";
import { id } from "date-fns/locale";
const Product_manager = () => {
  const { showLoading, hideLoading } = useLoading();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const columns = [
    {
      key: "id",
      label: "ID",
      width: "80px",
    },
    {
      key: "title",
      label: "Tên sản phẩm",
      width: "200px",
    },
    {
      key: "slug",
      label: "Slug",
      width: "250px",
    },
    {
      key: "price",
      label: "Giá",
      width: "150px",
    },
    {
      key: "description",
      label: "Mô tả",
      width: "150px",
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
  return (
    <div className="p-6">
      <div></div>
      <TableCustom
        data={products}
        columns={columns}
        rows={10} // Số dòng trên mỗi trang
        header="Danh sách sản phẩm từ hệ thống"
      />
    </div>
  );
};
export default Product_manager;
