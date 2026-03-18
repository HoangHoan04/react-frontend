import CustomButton from "@/components/common/button/Button";
import CustomFileUpload from "@/components/common/FileUpload";
import CustomImage from "@/components/common/Image";
import CustomInputText from "@/components/common/input/InputText";
import CustomModal from "@/components/common/Modal";
import DataTable from "@/components/common/table/DataTable";
import CustomConfirmDialog from "@/components/ui/ConfirmDialog";
import {
  useCreateCategory,
  useDeleteCategory,
  useGetCategories,
  useUpdateCategory,
} from "@/hooks";
import { useThemeStore, useToastStore } from "@/stores";
import { useCallback, useMemo, useState } from "react";
import { ROUTES } from "../../../common/constants/routes";
import { Accordion, AccordionTab } from "../../../components/common/Accordion";
import CustomTooltipButton from "../../../components/common/button/TooltipButton";
import { useRouter } from "../../../route/hooks/use-router";

export default function CategoryManager() {
  // Hook golbal
  const showToast = useToastStore((state) => state.showToast);
  const theme = useThemeStore((state) => state.theme);
  const router = useRouter();

  // State local
  const [slugContains, setSlugContains] = useState("");
  const [slugExact, setSlugExact] = useState("");
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [slug, setSlug] = useState("");
  const [formErrors, setFormErrors] = useState({});

  // Hook CRUD cho Category
  const { categories, isLoading, error, refetch } = useGetCategories();
  const { mutateAsync: createCategory, isPending: isCreating } =
    useCreateCategory();
  const { mutateAsync: updateCategory, isPending: isUpdating } =
    useUpdateCategory(editingCategory?.id);
  const { mutateAsync: deleteCategory, isPending: isDeleting } =
    useDeleteCategory(categoryToDelete?.id);

  // Derived state
  const isDark = theme === "dark";
  const isFormSubmitting = isCreating || isUpdating;
  const isEditMode = Boolean(editingCategory?.id);

  // Memoized values and callbacks
  const filteredCategories = useMemo(() => {
    return (categories || []).filter((item) => {
      const slugValue = (item?.slug || "").toLowerCase().trim();
      const containsValue = slugContains.toLowerCase().trim();
      const exactValue = slugExact.toLowerCase().trim();

      const matchedContains =
        !containsValue || slugValue.includes(containsValue);
      const matchedExact = !exactValue || slugValue === exactValue;

      return matchedContains && matchedExact;
    });
  }, [categories, slugContains, slugExact]);

  const openDeleteDialog = useCallback((category) => {
    setCategoryToDelete(category);
    setIsDeleteDialogVisible(true);
  }, []);

  const closeDeleteDialog = useCallback(() => {
    if (isDeleting) return;
    setIsDeleteDialogVisible(false);
    setCategoryToDelete(null);
  }, [isDeleting]);

  const resetCategoryForm = useCallback(() => {
    setName("");
    setImage("");
    setSlug("");
    setFormErrors({});
  }, []);

  const openCreateModal = useCallback(() => {
    setEditingCategory(null);
    resetCategoryForm();
    setIsCategoryModalVisible(true);
  }, [resetCategoryForm]);

  const openEditModal = useCallback((category) => {
    setEditingCategory(category);
    setName(category?.name || "");
    setImage(category?.image || "");
    setSlug(category?.slug || "");
    setFormErrors({});
    setIsCategoryModalVisible(true);
  }, []);

  const closeCategoryModal = useCallback(() => {
    if (isFormSubmitting) return;
    setIsCategoryModalVisible(false);
    setEditingCategory(null);
    resetCategoryForm();
  }, [isFormSubmitting, resetCategoryForm]);

  const handleSubmitCategory = useCallback(async () => {
    const trimmedName = name.trim();
    const trimmedImage = image.trim();
    const trimmedSlug = slug.trim();

    const nextErrors = {};
    if (!trimmedName) nextErrors.name = "Vui lòng nhập tên thể loại.";
    if (!trimmedImage) nextErrors.image = "Vui lòng nhập URL ảnh.";

    if (Object.keys(nextErrors).length > 0) {
      setFormErrors(nextErrors);
      return;
    }

    const payload = {
      name: trimmedName,
      image: trimmedImage,
      ...(trimmedSlug ? { slug: trimmedSlug } : {}),
    };

    try {
      if (isEditMode) {
        await updateCategory(payload);
      } else {
        await createCategory(payload);
      }

      await refetch();
      showToast({
        type: "success",
        title: isEditMode ? "Cập nhật thành công" : "Thêm mới thành công",
        message: isEditMode
          ? `Đã cập nhật thể loại "${trimmedName}".`
          : `Đã thêm thể loại "${trimmedName}".`,
      });
      closeCategoryModal();
    } catch {
      showToast({
        type: "error",
        title: isEditMode ? "Cập nhật thất bại" : "Thêm mới thất bại",
        message:
          "Không thể lưu thể loại. Vui lòng kiểm tra dữ liệu và thử lại.",
      });
    }
  }, [
    closeCategoryModal,
    createCategory,
    image,
    isEditMode,
    name,
    refetch,
    showToast,
    slug,
    updateCategory,
  ]);

  const handleConfirmDelete = useCallback(async () => {
    if (!categoryToDelete?.id) return;

    try {
      await deleteCategory();
      await refetch();
      showToast({
        type: "success",
        title: "Xóa thành công",
        message: `Đã xóa thể loại "${categoryToDelete.name}".`,
      });
    } catch {
      showToast({
        type: "error",
        title: "Xóa thất bại",
        message: "Không thể xóa thể loại. Vui lòng thử lại.",
      });
    } finally {
      setCategoryToDelete(null);
    }
  }, [categoryToDelete, deleteCategory, refetch, showToast]);

  const columns = useMemo(
    () => [
      {
        field: "id",
        header: "ID",
        width: "70px",
      },
      {
        field: "name",
        header: "Tên thể loại",
      },
      {
        field: "slug",
        header: "Slug",
      },
      {
        field: "image",
        header: "Ảnh",
        width: "220px",
        sortable: false,
        body: (row) => (
          <CustomImage
            src={row.image}
            alt={row.name}
            previewTitle={`Ảnh thể loại: ${row.name}`}
            emptyText="Không có ảnh"
            thumbnailClassName="h-20 w-20 rounded-md object-cover"
          />
        ),
      },
      {
        field: "actions",
        header: "Hành động",
        width: "150px",
        sortable: false,
        body: (row) => (
          <div className="flex gap-2">
            <CustomTooltipButton
              tooltip="Xem chi tiết"
              icon="pi pi-eye"
              severity="info"
              outlined
              onClick={() =>
                router.push(
                  ROUTES.MAIN.CATEGORY_MANAGER.children.DETAIL_CATEGORY.path.replace(
                    ":id",
                    row.id,
                  ),
                )
              }
              size="small"
            />
            <CustomTooltipButton
              tooltip="Sửa"
              icon="pi pi-pencil"
              severity="warning"
              outlined
              onClick={() => openEditModal(row)}
              size="small"
            />
            <CustomTooltipButton
              tooltip="Xóa"
              icon="pi pi-trash"
              severity="danger"
              outlined
              size="small"
              onClick={() => openDeleteDialog(row)}
            />
          </div>
        ),
      },
    ],
    [openDeleteDialog, openEditModal, router],
  );

  return (
    <div className="space-y-4">
      <div
        className={`rounded-2xl border p-4 shadow-sm ${
          isDark ? "border-[#2f2f2f] bg-[#1f1f1f]" : "border-gray-200 bg-white"
        }`}
      >
        <Accordion multiple className="mb-4">
          <AccordionTab
            header="Tìm kiếm"
            headerClassName={
              isDark ? "bg-[#202020] text-gray-100" : "bg-[#f8fbff]"
            }
            contentClassName={isDark ? "bg-[#171717]" : "bg-white"}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <CustomInputText
                label="Slug chứa"
                value={slugContains}
                onChange={(e) => setSlugContains(e.target.value)}
                placeholder="Ví dụ: shoes"
                isDark={isDark}
                containerClassName="w-full"
              />
              <CustomInputText
                label="Slug chính xác"
                value={slugExact}
                onChange={(e) => setSlugExact(e.target.value)}
                placeholder="Ví dụ: clothes"
                isDark={isDark}
                containerClassName="w-full"
              />
            </div>
          </AccordionTab>
        </Accordion>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <CustomButton
            label="Thêm thể loại"
            icon="pi pi-plus-circle"
            severity="success"
            outlined
            onClick={openCreateModal}
          />
        </div>
        <div className="flex items-center gap-2">
          <CustomButton
            label="Tải lại"
            icon="pi pi-refresh"
            severity="info"
            outlined
            loading={isLoading}
            onClick={async () => {
              await refetch();
              showToast({
                type: "info",
                title: "Đã tải lại",
                message: "Danh sách thể loại đã được cập nhật từ API.",
              });
            }}
          />
        </div>
      </div>

      <div
        className={`space-y-4 rounded-2xl border p-4 shadow-sm ${
          isDark ? "border-[#2f2f2f] bg-[#1f1f1f]" : "border-gray-200 bg-white"
        }`}
      >
        {error ? (
          <div
            className={`rounded-lg border px-4 py-3 text-sm ${
              isDark
                ? "border-red-500/40 bg-red-950/30 text-red-300"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            Không thể tải danh sách thể loại. Vui lòng thử lại sau.
          </div>
        ) : null}

        <DataTable
          data={filteredCategories}
          columns={columns}
          rows={5}
          rowsPerPageOptions={[5, 10, 20]}
          emptyMessage={isLoading ? "Đang tải dữ liệu..." : "Không có dữ liệu"}
        />
      </div>

      <CustomConfirmDialog
        visible={isDeleteDialogVisible}
        onHide={closeDeleteDialog}
        header="Xác nhận xóa thể loại"
        message={`Bạn có chắc chắn muốn xóa thể loại "${categoryToDelete?.name || ""}" không?`}
        severity="danger"
        acceptLabel="Xóa"
        rejectLabel="Hủy"
        icon="pi pi-trash"
        isDark={isDark}
        onAccept={handleConfirmDelete}
      />

      <CustomModal
        visible={isCategoryModalVisible}
        onHide={closeCategoryModal}
        header={isEditMode ? "Chỉnh sửa thể loại" : "Thêm thể loại"}
        showHeader
        closeButton
        showFooter
        modalWidth="max-w-xl"
        isDark={isDark}
        footer={
          <>
            <CustomButton
              label="Hủy"
              icon="pi pi-times"
              severity="danger"
              outlined
              disabled={isFormSubmitting}
              onClick={closeCategoryModal}
            />
            <CustomButton
              outlined
              label={isEditMode ? "Cập nhật" : "Tạo mới"}
              icon={isEditMode ? "pi pi-pen-to-square" : "pi pi-plus-circle"}
              severity={isEditMode ? "warning" : "success"}
              loading={isFormSubmitting}
              onClick={handleSubmitCategory}
            />
          </>
        }
      >
        <div className="grid grid-cols-1 gap-4">
          <CustomInputText
            label="Tên thể loại"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (formErrors.name) {
                setFormErrors((prev) => ({ ...prev, name: "" }));
              }
            }}
            placeholder="Nhập tên thể loại"
            isDark={isDark}
            error={Boolean(formErrors.name)}
            errorMessage={formErrors.name}
            containerClassName="w-full"
            disabled={isFormSubmitting}
          />

          <CustomInputText
            label="Slug (tùy chọn)"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="Ví dụ: clothes"
            isDark={isDark}
            containerClassName="w-full"
            disabled={isFormSubmitting}
          />

          <CustomFileUpload
            label="Ảnh thể loại"
            value={image}
            onChange={(uploadedUrl) => {
              setImage(uploadedUrl || "");
              if (formErrors.image) {
                setFormErrors((prev) => ({ ...prev, image: "" }));
              }
            }}
            emptyText="Không có ảnh"
            isDark={isDark}
            disabled={isFormSubmitting}
            previewTitle="Xem chi tiết ảnh thể loại"
          />

          {formErrors.image ? (
            <p
              className={`-mt-2 text-xs font-medium ${isDark ? "text-red-400" : "text-red-600"}`}
            >
              {formErrors.image}
            </p>
          ) : null}
        </div>
      </CustomModal>
    </div>
  );
}
