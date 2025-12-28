
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/libs/api";
import { CreatePrizeDto } from "@/libs/types";
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

    const revealPrizeMutation = useMutation({
        mutationFn: (prizeId: string) => api.revealPrize(prizeId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["prizes"] });
            toast.success(`Đã công bố người trúng giải!`);
        },
        onError: (error: any) => {
            if (error.response?.status === 400) {
                toast.error("Giải thưởng đã được công bố rồi");
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
        revealPrize: revealPrizeMutation.mutateAsync,
        isRevealing: revealPrizeMutation.isPending,
    };
};
