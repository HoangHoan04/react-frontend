import CustomButton from "@/components/common/button/Button";
import CustomImage from "@/components/common/Image";
import DataTable from "@/components/common/table/DataTable";
import { useThemeStore } from "@/stores";
import { formatDate } from "@/utils/date.util";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { ROUTES } from "../../../../common/constants/routes";
import { useDetailCategory } from "../../../../hooks/categories";
import { useRouter } from "../../../../route/hooks/use-router";

export default function CategoryDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { category } = useDetailCategory(id);
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === "dark";

  const relatedProductsColumns = useMemo(
    () => [
      {
        field: "id",
        header: "ID",
        width: "70px",
      },
      {
        field: "title",
        header: "Tên sản phẩm",
      },
      {
        field: "price",
        header: "Giá",
        body: (row) => (
          <span className="font-medium">
            ${row.price?.toFixed(2) || "0.00"}
          </span>
        ),
      },
      {
        field: "image",
        header: "Ảnh",
        width: "140px",
        sortable: false,
        body: (row) => (
          <CustomImage
            src={row.image}
            alt={row.title}
            previewTitle={`Ảnh: ${row.title}`}
            emptyText="Không có"
            thumbnailClassName="h-10 w-10 rounded-md object-cover"
          />
        ),
      },
    ],
    [],
  );

  if (!category) {
    return (
      <div className="space-y-4">
        <div
          className={`rounded-2xl border p-4 shadow-sm ${
            isDark
              ? "border-[#2f2f2f] bg-[#1f1f1f]"
              : "border-gray-200 bg-white"
          }`}
        >
          <div className="flex items-center gap-3">
            <CustomButton
              label="Quay lại"
              icon="pi pi-arrow-left"
              severity="secondary"
              outlined
              onClick={() => router.push(ROUTES.MAIN.CATEGORY_MANAGER.path)}
            />
          </div>
        </div>
        <div
          className={`rounded-2xl border p-8 shadow-sm text-center ${
            isDark
              ? "border-[#2f2f2f] bg-[#1f1f1f]"
              : "border-gray-200 bg-white"
          }`}
        >
          <p className={isDark ? "text-gray-400" : "text-gray-600"}>
            Không tìm thấy danh mục
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div
        className={`rounded-2xl border p-4 shadow-sm ${
          isDark ? "border-[#2f2f2f] bg-[#1f1f1f]" : "border-gray-200 bg-white"
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <CustomButton
              label="Quay lại"
              icon="pi pi-arrow-left"
              severity="secondary"
              outlined
              onClick={() => router.push(ROUTES.MAIN.CATEGORY_MANAGER.path)}
            />
          </div>
          <div className="flex items-center gap-2">
            <CustomButton
              label="Chỉnh sửa"
              icon="pi pi-pencil"
              severity="warning"
              outlined
              onClick={() => {}}
            />
            <CustomButton
              label="Xóa"
              icon="pi pi-trash"
              severity="danger"
              outlined
              onClick={() => {}}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`rounded-2xl border p-6 shadow-sm ${
          isDark ? "border-[#2f2f2f] bg-[#1f1f1f]" : "border-gray-200 bg-white"
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Category Image */}
          <div className="md:col-span-1">
            <h3 className="font-semibold mb-3">Ảnh danh mục</h3>
            <div
              className={`rounded-lg border p-4 ${
                isDark
                  ? "border-[#333] bg-[#111]"
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              {category.image ? (
                <CustomImage
                  src={category.image}
                  alt={category.name}
                  previewTitle={`Ảnh danh mục: ${category.name}`}
                  thumbnailClassName="w-full h-auto rounded-md object-cover"
                  containerClassName="flex justify-center"
                />
              ) : (
                <div
                  className={`h-48 flex items-center justify-center rounded-md ${
                    isDark ? "bg-[#222]" : "bg-gray-200"
                  }`}
                >
                  <span className={isDark ? "text-gray-500" : "text-gray-400"}>
                    Không có ảnh
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Category Info */}
          <div className="md:col-span-2">
            <h3 className="font-semibold mb-3">Thông tin danh mục</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 xl:grid-rows-3 gap-3">
              <div className={`p-3 xl:col-span-2 `}>
                <label
                  className={`text-sm font-medium block mb-1 ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  ID
                </label>
                <p className="text-base font-semibold">{category.id}</p>
              </div>

              <div className={`p-3 xl:col-span-2`}>
                <label
                  className={`text-sm font-medium block mb-1 ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Tên danh mục
                </label>
                <p className="text-base font-semibold">{category.name}</p>
              </div>

              <div className={` p-3 xl:col-span-2 `}>
                <label
                  className={`text-sm font-medium block mb-1 ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Slug
                </label>
                <p
                  className={`text-base font-mono ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {category.slug}
                </p>
              </div>

              <div className={` p-3 xl:col-span-2`}>
                <label
                  className={`text-sm font-medium block mb-1 ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Số sản phẩm
                </label>
                <p className="text-base font-semibold">
                  {Array.isArray(category.products)
                    ? category.products.length
                    : 0}
                </p>
              </div>

              <div className={` p-3 xl:col-span-2`}>
                <label
                  className={`text-sm font-medium block mb-1 ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Ngày tạo
                </label>
                <p className="text-base">{formatDate(category.creationAt)}</p>
              </div>

              <div className={` p-3 xl:col-span-2`}>
                <label
                  className={`text-sm font-medium block mb-1 ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Ngày cập nhật
                </label>
                <p className="text-base">{formatDate(category.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div
        className={`rounded-2xl border p-6 shadow-sm ${
          isDark ? "border-[#2f2f2f] bg-[#1f1f1f]" : "border-gray-200 bg-white"
        }`}
      >
        <h3 className="font-bold text-lg mb-4">Sản phẩm trong danh mục</h3>
        <DataTable
          data={category.products || []}
          columns={relatedProductsColumns}
          rows={5}
          rowsPerPageOptions={[5, 10, 20]}
          emptyMessage="Không có sản phẩm nào"
        />
      </div>
    </div>
  );
}
