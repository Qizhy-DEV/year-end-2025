
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/libs/api";
import { CreatePrizeDto, UpdatePrizeLuckyNumberDto } from "@/libs/types";
import toast from "react-hot-toast";

export const usePrizes = (page: number = 1, limit: number = 10) => {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ["prizes", page, limit],
        queryFn: () => api.getPrizes(page, limit),
    });

    const createPrizeMutation = useMutation({
        mutationFn: (data: CreatePrizeDto) => api.createPrize(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["prizes"] });
            toast.success("Thêm giải thưởng thành công!");
        },
        onError: () => {
            toast.error("Không thể thêm giải thưởng");
        },
    });

    const updateLuckyNumberMutation = useMutation({
        mutationFn: ({ prizeId, data }: { prizeId: string; data: UpdatePrizeLuckyNumberDto }) => 
            api.updatePrizeLuckyNumber(prizeId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["prizes"] });
            toast.success("Cập nhật số may mắn thành công!");
        },
        onError: (error: any) => {
            if (error.response?.status === 400) {
                toast.error("Không thể cập nhật số may mắn cho giải thưởng đã công bố");
            } else if (error.response?.status === 404) {
                const message = error.response?.data?.message || "Không tìm thấy người dùng với số may mắn này";
                toast.error(message);
            } else {
                toast.error("Không thể cập nhật số may mắn");
            }
        },
    });

    const revealPrizeMutation = useMutation({
        mutationFn: (prizeId: string) => api.revealPrize(prizeId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["prizes"] });
            toast.success(`Đã công bố người trúng giải!`);
        },
        onError: (error: any) => {
            if (error.response?.status === 400) {
                const message = error.response?.data?.message || "Giải thưởng đã được công bố rồi hoặc chưa có số may mắn";
                toast.error(message);
            } else if (error.response?.status === 404) {
                toast.error("Không tìm thấy người trúng giải");
            } else {
                toast.error("Không thể công bố giải thưởng");
            }
        },
    });

    return {
        ...query,
        createPrize: createPrizeMutation.mutateAsync,
        isCreating: createPrizeMutation.isPending,
        updateLuckyNumber: updateLuckyNumberMutation.mutateAsync,
        isUpdatingLuckyNumber: updateLuckyNumberMutation.isPending,
        revealPrize: revealPrizeMutation.mutateAsync,
        isRevealing: revealPrizeMutation.isPending,
    };
};
