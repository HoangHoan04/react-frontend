import CustomImage from "@/components/common/Image";
import DataTable from "@/components/common/table/DataTable";
import CustomButton from "@/components/common/button/Button";
import CustomModal from "@/components/common/Modal";
import CustomConfirmDialog from "@/components/ui/ConfirmDialog";
import CustomFileUpload from "@/components/common/FileUpload";
import CustomInputText from "@/components/common/input/InputText";
import { Accordion, AccordionTab } from "@/components/common/Accordion";

import {
    useGetUsers,
    useCreateUser,
    useDeleteUser,
    useUpdateUser,
} from "@/hooks";

import { useThemeStore, useToastStore } from "@/stores";
import { useMemo, useState } from "react";
import CustomTooltipButton from "../../../components/common/button/TooltipButton";

export default function CustomersManager() {

     /* ================= GLOBAL ================= */

    const showToast = useToastStore((state) => state.showToast);
    const theme = useThemeStore((state) => state.theme);
    const isDark = theme === "dark";
    

    /* ================= STATE ================= */

    const [nameContains, setNameContains] = useState("");
    const [nameExact, setNameExact] = useState("");

    const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    const [isUserModalVisible, setIsUserModalVisible] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [avatar, setAvatar] = useState("");

    const [formErrors, setFormErrors] = useState({});

    /* ================= API ================= */

    const { users = [], isLoading, error, refetch } = useGetUsers();

    const { mutateAsync: createUser, isPending: isCreating } = useCreateUser();
    const { mutateAsync: deleteUser, isPending: isDeleting } = useDeleteUser();
    const { mutateAsync: updateUser, isPending: isUpdating } = useUpdateUser(editingUser?.id);

    const isFormSubmitting = isCreating || isUpdating;
    const isEditModal = Boolean(editingUser?.id);

    /* ================= FILTER ================= */

    const filteredUsers = useMemo(() => {
        return users
        .filter((user) => user.role === "customer")
        .filter((user) => {
            const nameValue = (user?.name || "").toLowerCase().trim();
            const containsValue = nameContains.toLowerCase().trim();

            const matchedContains =
            !containsValue || nameValue.includes(containsValue);

            const exactValue = nameExact.toLowerCase().trim();
            const matchedExact = !exactValue || nameValue === exactValue;

            return matchedContains && matchedExact;
        });
    }, [users, nameContains, nameExact]);

    /* ================= FORM ================= */

    const resetForm = () => {
        setName("");
        setEmail("");
        setAvatar("");
        setPassword("");
        setFormErrors({});
    };

    const openCreateModal = () => {
        setEditingUser(null);
        resetForm();
        setIsUserModalVisible(true);
    };

    const openEditModal = (user) => {
        setEditingUser(user);
        setName(user.name || "");
        setEmail(user.email || "");
        setAvatar(user.avatar || "");
        setFormErrors({});
        setIsUserModalVisible(true);
    };

    const closeUserModal = () => {
        if (isFormSubmitting) return;
        setIsUserModalVisible(false);
        setEditingUser(null);
        resetForm();
    };

    /* ================= DELETE ================= */

    const openDeleteDialog = (user) => {
        setUserToDelete(user);
        setIsDeleteDialogVisible(true);
    };

    const closeDeleteDialog = () => {
        if (isDeleting) return;
        setIsDeleteDialogVisible(false);
        setUserToDelete(null);
    };

    /* ================= SUBMIT ================= */

    const handleSubmit = async () => {
        const trimmedName = name.trim();
        const trimmedEmail = email.trim();

        const errors = {};

        if (!trimmedName) errors.name = "Nhập tên";
        if (!trimmedEmail) errors.email = "Nhập email";

        if (!isEditModal) {
            if (!password) errors.password = "Nhập mật khẩu";
            else if (password.length < 4)
                errors.password = "Mật khẩu tối thiểu 4 ký tự";
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        try {
            if (isEditModal && editingUser?.id) {
                await updateUser({
                    name: trimmedName,
                    email: trimmedEmail,
                    avatar,
                });
            } else {
                await createUser({
                    name: trimmedName,
                    email: trimmedEmail,
                    password,
                    avatar,
                    role: "customer",
                });
            }

            await refetch();

            showToast({
                type: "success",
                title: "Thành công",
                message: isEditModal
                    ? "Cập nhật khách hàng thành công"
                    : "Thêm khách hàng thành công",
            });

            closeUserModal();
        } catch (err) {
            console.log(err); // 👈 debug thêm
            showToast({
                type: "error",
                title: "Thất bại",
                message: "Không thể lưu khách hàng",
            });
        }
    };
    /* ================= DELETE CONFIRM ================= */

    const handleDelete = async () => {
        if (!userToDelete?.id) return;

        try {
        await deleteUser(userToDelete.id);
        await refetch();

        showToast({
            type: "success",
            title: "Đã xóa",
            message: `Đã xóa khách hàng ${userToDelete.name}`,
        });
        } catch {
        showToast({
            type: "error",
            title: "Thất bại",
            message: "Không thể xóa khách hàng",
        });
        } finally {
        setUserToDelete(null);
        }
    };

    /* ================= TABLE ================= */

    const columns = [
        { field: "id", header: "ID", width: "80px" },

        { field: "name", header: "Tên" },

        { field: "email", header: "Email" },

        {
        field: "avatar",
        header: "Ảnh",
        body: (row) => (
            <CustomImage
            src={row.avatar}
            alt={row.name}
            thumbnailClassName="h-20 w-20 rounded-full object-cover"
            />
        ),
        },

        {
        field: "actions",
        header: "Hành động",
        body: (row) => (
            <div className="flex gap-2">

            <CustomTooltipButton
                tooltip="Sửa"
                icon="pi pi-pencil"
                severity="warning"
                outlined
                onClick={() => openEditModal(row)}
            />

            <CustomTooltipButton
                tooltip="Xóa"
                icon="pi pi-trash"
                severity="danger"
                outlined
                onClick={() => openDeleteDialog(row)}
            />

            </div>
        ),
        },
    ];

    /* ================= UI ================= */

    return (
        <div className="space-y-4">

        {/* SEARCH */}
        <div
            className={`rounded-2xl border p-4 shadow-sm ${
            isDark ? "border-[#2f2f2f] bg-[#1f1f1f]" : "border-gray-200 bg-white"
            }`}
        >
        <Accordion multiple isOpen>
            <AccordionTab
                header="Tìm kiếm"
                headerClassName={
                isDark ? "bg-[#202020] text-gray-100" : "bg-[#f8fbff]"
                    }
                contentClassName={isDark ? "bg-[#171717]" : "bg-white"}
            >
            <div className="grid md:grid-cols-2 gap-3">

                <CustomInputText
                label="Tên chứa"
                value={nameContains}
                onChange={(e) => setNameContains(e.target.value)}
                isDark={isDark}
                />

                <CustomInputText
                label="Tên chính xác"
                value={nameExact}
                onChange={(e) => setNameExact(e.target.value)}
                isDark={isDark}
                />

            </div>
            </AccordionTab>
        </Accordion>
        </div>
        {/* BUTTON */}
        <div className="flex justify-between">

            <CustomButton
                label="Thêm khách hàng"
                icon="pi pi-plus-circle"
                severity="success"
                outlined
                onClick={openCreateModal}
            />

            <CustomButton
                label="Reload"
                icon="pi pi-refresh"
                severity="info"
                outlined
                onClick={refetch}
            />

        </div>

        {/* TABLE */}
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
                data={filteredUsers}
                columns={columns}
                rows={5}
                emptyMessage={isLoading ? "Đang tải..." : "Không có dữ liệu"}
            />
        </div>
        {/* DELETE */}
        <CustomConfirmDialog
            visible={isDeleteDialogVisible}
            onHide={closeDeleteDialog}
            message={`Xóa "${userToDelete?.name}" ?`}
            onAccept={handleDelete}
            isDark={isDark}
        />

        {/* MODAL */}
        <CustomModal
            visible={isUserModalVisible}
            onHide={closeUserModal}
            header={isEditModal ? "Sửa khách hàng" : "Thêm khách hàng"}
            modalWidth="max-w-xl"
            isDark={isDark}
            showFooter
            footer={
            <>
                <CustomButton label="Hủy" onClick={closeUserModal} />

                <CustomButton
                label="Lưu"
                onClick={handleSubmit}
                />
            </>
            }
        >

            <div className="space-y-3">

            <CustomInputText
                label="Tên"
                value={name}
                onChange={(e) => {
                    setName(e.target.value);
                    if (formErrors.name) {
                        setFormErrors((prev) => ({ ...prev, name: "" }));
                    }
                }}
                isDark={isDark}
                error={Boolean(formErrors.name)}
                errorMessage={formErrors.name}
            />

            <CustomInputText
                label="Email"
                value={email}
                onChange={(e) => {
                    setEmail(e.target.value);
                    if (formErrors.email) {
                        setFormErrors((prev) => ({ ...prev, email: "" }));
                    }
                }}
                isDark={isDark}
                error={Boolean(formErrors.email)}
                errorMessage={formErrors.email}
            />
            {!isEditModal && (
            <CustomInputText
                label="Mật khẩu"
                type="password"
                value={password}
                onChange={(e) => {
                    setPassword(e.target.value);
                    if (formErrors.password) {
                        setFormErrors((prev) => ({ ...prev, password: "" }));
                    }
                }}
                placeholder="Nhập mật khẩu"
                isDark={isDark}
                error={Boolean(formErrors.password)}
                errorMessage={formErrors.password}
            />
            )}
            <CustomFileUpload
                label="Avatar"
                value={avatar}
                onChange={(url) => setAvatar(url || "")}
                isDark={isDark}
            />

            </div>

        </CustomModal>

        </div>
    );
}
