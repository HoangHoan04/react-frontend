import CustomButton from "@/components/common/button/Button";
import CustomFileUpload from "@/components/common/FileUpload";
import CustomImage from "@/components/common/Image";
import CustomInputText from "@/components/common/input/InputText";
import CustomModal from "@/components/common/Modal";
import DataTable from "@/components/common/table/DataTable";
import CustomConfirmDialog from "@/components/ui/ConfirmDialog";
import {
    useGetUsers,
    useCreateUser,
    useDeleteUser,
    useUpdateUser,
} from "@/hooks";
import { useThemeStore, useToastStore } from "@/stores";
import { useCallback, useMemo, useState } from "react";
import { ROUTES } from "../../../common/constants/routes";
import { Accordion, AccordionTab } from "../../../components/common/Accordion";
import CustomTooltipButton from "../../../components/common/button/TooltipButton";
import { useRouter } from "../../../route/hooks/use-router";
import { data, useParams } from "react-router-dom";

export default function EmployeesManager() {
    // Hook golbal
    const showToast = useToastStore((state) => state.showToast);
    const theme = useThemeStore((state) => state.theme);
    const router = useRouter();

    
    const {users = [], isLoading, error, refetch} = useGetUsers();
    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            return user.role === "admin";
        });
    }, [users]);
    console.log(filteredUsers);
    
    const {createUser, isLoading: isCreating} = useCreateUser();
    const {deleteUser, isLoading: isDeleting} = useDeleteUser();
    const {updateUser, isLoading: isUpdating} = useUpdateUser();

    const colums = useMemo(() => [
        {
            field: "id",
            header: "ID",
            width: "100px",
        },
        {
            field: "email",
            header: "Email",
        },
        {
            field: "password",
            header: "Mật khẩu",
        },
        {
            field: "name",
            header: "Tên",
        },
        {
            field: "avatar",
            header: "Ảnh",
            body: (row) => (
                <CustomImage>
                    src={row.avatar}
                    alt={row.name}
                    thumbnailClassname="w-16 h-16 rouned-full"
                </CustomImage>
            ),
        },
        {
            field: "action",
            header: "Hành động",
            body: (row) => (
                <div className="flex gap-2">
                    <CustomTooltipButton
                        tooltip="Sửa"
                        icon="pi pi-pencil"
                        onclick={() => {console.log(row)}}
                    />
                    <CustomTooltipButton
                        tooltip="Xóa"
                        icon="pi pi-trash"
                        onclick={async() => {
                            if(window.confirm("Bạn có chắc muốn xóa nhân viên này?")){
                                await deleteUser(row.id);
                                showToast("success", "Xóa nhân viên thành công");
                                refetch();
                            }
                        }}
                    />
                </div>
            ),
        },
        ],[deleteUser, refetch]);
    return (
        <div className="p-4 space-y-4">
            <h1 className="text-2xl font-bold">Quản lý nhân viên</h1>

            {error && <p className="text-red-500">Lỗi tải dữ liệu</p>}

            <DataTable
                data={filteredUsers}
                columns={colums}
                rows={5}
                emptyMessage={isLoading ? "Đang tải..." : "Không có dữ liệu"}
            />
        </div>
    );
}
