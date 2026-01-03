"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../../libs/auth";
import type { Prize, CreatePrizeDto } from "../../../libs/types";
import AdminLayout from "../components/layout";
import toast from "react-hot-toast";
import { Gift, Plus, Trophy, Edit } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
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
import { usePrizes } from "@/hooks/use-prizes";

export default function PrizesPage() {
  const router = useRouter();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateLuckyNumberModalOpen, setIsUpdateLuckyNumberModalOpen] =
    useState(false);
  const [selectedPrize, setSelectedPrize] = useState<Prize | null>(null);
  const [luckyNumber, setLuckyNumber] = useState<number>(0);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // Use query hook
  const {
    data,
    isLoading,
    isError,
    createPrize,
    isCreating,
    updateLuckyNumber,
    isUpdatingLuckyNumber,
  } = usePrizes(currentPage, pageSize);

  const prizes = data?.prizes || [];
  const totalPrizes = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  // Form state
  const [newPrize, setNewPrize] = useState<CreatePrizeDto>({
    name: "",
  });

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      router.push("/admin");
      return;
    }
  }, [router]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAddPrize = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPrize.name) {
      toast.error("Vui lòng nhập tên giải thưởng");
      return;
    }

    try {
      await createPrize(newPrize);
      setIsAddModalOpen(false);
      setNewPrize({ name: "" });
      // Reset to first page to see the new prize
      setCurrentPage(1);
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleOpenUpdateLuckyNumber = (prize: Prize) => {
    setSelectedPrize(prize);
    setLuckyNumber(prize.lucky_number || 0);
    setIsUpdateLuckyNumberModalOpen(true);
  };

  const handleUpdateLuckyNumber = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPrize || !luckyNumber) {
      toast.error("Vui lòng nhập số may mắn");
      return;
    }

    try {
      await updateLuckyNumber({
        prizeId: selectedPrize._id,
        data: { lucky_number: luckyNumber },
      });
      setIsUpdateLuckyNumberModalOpen(false);
      setSelectedPrize(null);
      setLuckyNumber(0);
    } catch (error) {
      // Error handled in hook
    }
  };

  const revealedPrizes = prizes.filter((p) => p.is_revealed).length;

  // Define table columns
  const columns: ColumnDef<Prize>[] = [
    {
      accessorKey: "name",
      header: "Tên Giải Thưởng",
      cell: ({ row }) => (
        <div className="flex items-center">
          <Trophy className="w-5 h-5 text-yellow-500 mr-2" />
          <span className="text-sm font-medium text-foreground">
            {row.original.name}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "lucky_number",
      header: "Số May Mắn",
      cell: ({ row }) =>
        row.original.lucky_number ? (
          <span className="text-sm font-bold text-primary">
            {row.original.lucky_number}
          </span>
        ) : (
          <span className="text-muted-foreground text-sm">Chưa có</span>
        ),
      size: 120,
    },
    {
      id: "winner",
      header: "Người Trúng Giải",
      cell: ({ row }) =>
        row.original.winner ? (
          <span className="text-sm font-medium text-foreground">
            {row.original.winner.full_name}
          </span>
        ) : (
          <span className="text-muted-foreground text-sm">Chưa có</span>
        ),
    },
    {
      id: "actions",
      header: "Hành Động",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {!row.original.is_revealed && !row.original.lucky_number && (
            <Button
              onClick={() => handleOpenUpdateLuckyNumber(row.original)}
              disabled={isUpdatingLuckyNumber}
              variant="outline"
              size="sm"
              className="text-primary hover:text-primary/80"
            >
              <Edit className="w-4 h-4 mr-1" />
              <span>Thêm số</span>
            </Button>
          )}
          {!row.original.is_revealed && row.original.lucky_number && (
            <Button
              onClick={() => handleOpenUpdateLuckyNumber(row.original)}
              disabled={isUpdatingLuckyNumber}
              variant="outline"
              size="sm"
              className="text-primary hover:text-primary/80"
            >
              <Edit className="w-4 h-4 mr-1" />
              <span>Sửa số</span>
            </Button>
          )}
        </div>
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
            <h1 className="text-2xl font-bold text-gray-900">
              Quản Lý Giải Thưởng
            </h1>
            <p className="text-gray-500">
              Quản lý danh sách giải thưởng và công bố người trúng giải.
            </p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="w-4 h-4" />
            <span>Thêm Giải Thưởng</span>
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    Tổng Số Giải Thưởng
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {totalPrizes}
                  </p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <Gift className="w-8 h-8 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    Đã Công Bố
                  </p>
                  <p className="text-3xl font-bold text-green-600 mt-1">
                    {revealedPrizes} / {prizes.length}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <Trophy className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Prizes Table */}
        <DataTable
          data={prizes}
          columns={columns}
          isLoading={isLoading}
          hasSort={true}
        />

        {/* Pagination */}
        <SimplePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalPrizes}
          pageSize={pageSize}
          onPageChange={handlePageChange}
        />

        {/* Winners Section */}
        {revealedPrizes > 0 && (
          <Card className="bg-linear-to-br from-yellow-50 to-orange-50 border-yellow-200">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900">
                <Trophy className="w-6 h-6 text-yellow-600 mr-2" />
                Danh Sách Người Trúng Giải
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {prizes
                  .filter((p) => p.is_revealed)
                  .map((prize) => (
                    <div
                      key={prize._id}
                      className="bg-white rounded-lg p-4 shadow-sm border border-yellow-300"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-600 mb-1">
                            {prize.name}
                          </p>
                          <p className="text-lg font-bold text-gray-900">
                            {prize.winner?.full_name}
                          </p>
                          {prize.lucky_number && (
                            <p className="text-sm text-primary font-semibold mt-1">
                              Số may mắn: {prize.lucky_number}
                            </p>
                          )}
                        </div>
                        <Trophy className="w-8 h-8 text-yellow-500" />
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add Prize Dialog */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm Giải Thưởng</DialogTitle>
            <DialogDescription>
              Nhập thông tin giải thưởng mới vào hệ thống
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddPrize} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên Giải Thưởng
              </label>
              <Input
                type="text"
                value={newPrize.name}
                onChange={(e) =>
                  setNewPrize({ ...newPrize, name: e.target.value })
                }
                placeholder="Giải Nhất - iPhone 15 Pro Max"
              />
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
                {isCreating ? "Đang xử lý..." : "Thêm"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Update Lucky Number Dialog */}
      <Dialog
        open={isUpdateLuckyNumberModalOpen}
        onOpenChange={setIsUpdateLuckyNumberModalOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cập Nhật Số May Mắn</DialogTitle>
            <DialogDescription>
              Nhập số may mắn cho giải thưởng: {selectedPrize?.name}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateLuckyNumber} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số May Mắn Trúng Giải
              </label>
              <Input
                type="number"
                value={luckyNumber || ""}
                onChange={(e) => setLuckyNumber(parseInt(e.target.value) || 0)}
                placeholder="123"
                min="1"
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsUpdateLuckyNumberModalOpen(false);
                  setSelectedPrize(null);
                  setLuckyNumber(0);
                }}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isUpdatingLuckyNumber}>
                {isUpdatingLuckyNumber ? "Đang xử lý..." : "Cập nhật"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
