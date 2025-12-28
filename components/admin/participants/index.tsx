"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../../libs/auth";
import type { User, CreateUserDto } from "../../../libs/types";
import AdminLayout from "../components/layout";
import toast from "react-hot-toast";
import { Upload, UserPlus, Search, CheckCircle, Users as UsersIcon } from "lucide-react";
import { Card, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../../../components/ui/dialog";
import DataTable, { type ColumnDef } from "../../../components/table";
import SimplePagination from "../../../components/table/simple-pagination";
import { useParticipants } from "@/hooks/use-participants";

export default function ParticipantsPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);

    // Use query hook
    const {
        data,
        isLoading,
        isError,
        createUser,
        isCreating,
        importUsers,
        isImporting
    } = useParticipants(currentPage, pageSize);

    const users = data?.users || [];
    const totalUsers = data?.total || 0;
    const totalPages = data?.totalPages || 1;

    // Filtered users state (client-side search on current page)
    // Note: Ideally search should be server-side, but keeping client-side for now as per requirement
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

    // Form states
    const [newUser, setNewUser] = useState<CreateUserDto>({
        full_name: "",
        lucky_number: 0,
        role: "employee",
    });
    const [csvFile, setCsvFile] = useState<File | null>(null);

    useEffect(() => {
        if (!auth.isAuthenticated()) {
            router.push("/admin");
            return;
        }
    }, [router]);

    useEffect(() => {
        if (users) {
            if (searchQuery.trim()) {
                const filtered = users.filter((user) =>
                    user.full_name.toLowerCase().includes(searchQuery.toLowerCase())
                );
                setFilteredUsers(filtered);
            } else {
                setFilteredUsers(users);
            }
        }
    }, [searchQuery, users]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newUser.full_name || !newUser.lucky_number) {
            toast.error("Vui lòng nhập đầy đủ thông tin");
            return;
        }

        try {
            await createUser(newUser);
            setIsAddModalOpen(false);
            setNewUser({ full_name: "", lucky_number: 0, role: "employee" });
        } catch (error) {
            // Error handled in hook
        }
    };

    const handleImportCSV = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!csvFile) {
            toast.error("Vui lòng chọn file CSV");
            return;
        }

        try {
            await importUsers(csvFile);
            setIsImportModalOpen(false);
            setCsvFile(null);
        } catch (error) {
            // Error handled in hook
        }
    };

    const checkedInUsers = users?.filter((u) => u.is_checked_in).length || 0;

    // Define table columns
    const columns: ColumnDef<User>[] = [
        {
            accessorKey: "lucky_number",
            header: "Số May Mắn",
            cell: ({ row }) => (
                <span className="text-sm font-bold text-primary">
                    {row.original.lucky_number}
                </span>
            ),
            size: 120,
        },
        {
            accessorKey: "full_name",
            header: "Họ và Tên",
            cell: ({ row }) => (
                <span className="text-sm font-medium text-foreground">
                    {row.original.full_name}
                </span>
            ),
        },
        {
            accessorKey: "role",
            header: "Vai Trò",
            cell: ({ row }) => (
                <Badge
                    variant={row.original.role === "employee" ? "default" : "secondary"}
                    className={
                        row.original.role === "employee"
                            ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                            : "bg-purple-100 text-purple-800 hover:bg-purple-200"
                    }
                >
                    {row.original.role === "employee" ? "Nhân viên" : "Khách mời"}
                </Badge>
            ),
            size: 120,
        },
        {
            accessorKey: "is_checked_in",
            header: "Trạng Thái",
            cell: ({ row }) =>
                row.original.is_checked_in ? (
                    <div className="flex items-center text-green-600 text-sm font-medium">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Đã check-in
                    </div>
                ) : (
                    <span className="text-muted-foreground text-sm">Chưa check-in</span>
                ),
            size: 150,
        },
    ];

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="text-gray-600">Đang tải...</div>
                </div>
            </AdminLayout>
        );
    }

    if (isError) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="text-red-600">Có lỗi xảy ra khi tải dữ liệu</div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Quản Lý Người Tham Dự</h1>
                        <p className="text-muted-foreground">
                            Danh sách và trạng thái check-in của tất cả người tham dự.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            onClick={() => setIsImportModalOpen(true)}
                            variant="secondary"
                            className="bg-green-600 text-white hover:bg-green-700"
                        >
                            <Upload className="w-4 h-4" />
                            <span>Import CSV</span>
                        </Button>
                        <Button onClick={() => setIsAddModalOpen(true)}>
                            <UserPlus className="w-4 h-4" />
                            <span>Thêm Mới</span>
                        </Button>
                    </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm font-medium">Tổng Số Người Tham Dự</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-1">{totalUsers}</p>
                                </div>
                                <div className="bg-blue-100 p-3 rounded-full">
                                    <UsersIcon className="w-8 h-8 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm font-medium">Đã Check-in (Trang này)</p>
                                    <p className="text-3xl font-bold text-green-600 mt-1">
                                        {checkedInUsers} / {users?.length}
                                    </p>
                                </div>
                                <div className="bg-green-100 p-3 rounded-full">
                                    <CheckCircle className="w-8 h-8 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Search */}
                <Card>
                    <CardContent className="p-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input
                                type="text"
                                placeholder="Tìm kiếm theo tên..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Users Table */}
                <DataTable
                    data={filteredUsers}
                    columns={columns}
                    isLoading={isLoading}
                    hasSort={true}
                />

                {/* Pagination */}
                <SimplePagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>

            {/* Add User Dialog */}
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Thêm Người Tham Dự</DialogTitle>
                        <DialogDescription>
                            Nhập thông tin người tham dự mới vào hệ thống
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddUser} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Họ và Tên
                            </label>
                            <Input
                                type="text"
                                value={newUser.full_name}
                                onChange={(e) =>
                                    setNewUser({ ...newUser, full_name: e.target.value })
                                }
                                placeholder="Nguyễn Văn A"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Số May Mắn
                            </label>
                            <Input
                                type="number"
                                value={newUser.lucky_number || ""}
                                onChange={(e) =>
                                    setNewUser({ ...newUser, lucky_number: parseInt(e.target.value) || 0 })
                                }
                                placeholder="123"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Vai Trò
                            </label>
                            <select
                                value={newUser.role}
                                onChange={(e) =>
                                    setNewUser({ ...newUser, role: e.target.value as "guest" | "employee" })
                                }
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            >
                                <option value="employee">Nhân viên</option>
                                <option value="guest">Khách mời</option>
                            </select>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsAddModalOpen(false)}
                            >
                                Hủy
                            </Button>
                            <Button type="submit" disabled={isCreating}>
                                {isCreating ? "Đang thêm..." : "Thêm"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Import CSV Dialog */}
            <Dialog open={isImportModalOpen} onOpenChange={setIsImportModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Import CSV</DialogTitle>
                        <DialogDescription>
                            Chọn file CSV để import danh sách người tham dự
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleImportCSV} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Chọn file CSV
                            </label>
                            <input
                                type="file"
                                accept=".csv"
                                onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                File CSV cần có các cột: lucky_number, full_name, role
                            </p>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsImportModalOpen(false)}
                            >
                                Hủy
                            </Button>
                            <Button
                                type="submit"
                                className="bg-green-600 hover:bg-green-700"
                                disabled={isImporting}
                            >
                                {isImporting ? "Đang import..." : "Import"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
