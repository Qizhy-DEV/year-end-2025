
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/libs/api";
import { CreateUserDto } from "@/libs/types";
import toast from "react-hot-toast";

export const useParticipantsStats = () => {
    return useQuery({
        queryKey: ["participants-stats"],
        queryFn: () => api.getUsersStats(),
    });
};

export const useParticipants = (
    page: number = 1,
    limit: number = 10,
    search?: string,
    isCheckedIn?: boolean,
    sort?: string
) => {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ["participants", page, limit, search, isCheckedIn, sort],
        queryFn: () => api.getUsers(page, limit, search, isCheckedIn, sort),
    });

    const createUserMutation = useMutation({
        mutationFn: (data: CreateUserDto) => api.createUser(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["participants"] });
            queryClient.invalidateQueries({ queryKey: ["participants-stats"] });
            toast.success("Thêm người tham dự thành công!");
        },
        onError: (error: any) => {
            if (error.response?.status === 400) {
                toast.error("Số may mắn đã tồn tại");
            } else {
                toast.error("Không thể thêm người tham dự");
            }
        },
    });

    const importUsersMutation = useMutation({
        mutationFn: (file: File) => api.importUsersCSV(file),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["participants"] });
            queryClient.invalidateQueries({ queryKey: ["participants-stats"] });
            toast.success(`Import thành công ${data.count} người tham dự!`);
        },
        onError: (error: any) => {
            if (error.response?.status === 400) {
                toast.error("File CSV không hợp lệ hoặc có số may mắn trùng");
            } else {
                toast.error("Không thể import file CSV");
            }
        },
    });

    const checkInUserMutation = useMutation({
        mutationFn: (userId: string) => api.checkInUser(userId),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["participants"] });
            queryClient.invalidateQueries({ queryKey: ["participants-stats"] });
            toast.success(`Check-in thành công: ${data.user.full_name}!`);
        },
        onError: (error: any) => {
            if (error.response?.status === 400) {
                toast.error("Người dùng đã check-in rồi");
            } else if (error.response?.status === 404) {
                toast.error("Không tìm thấy người dùng");
            } else {
                toast.error("Không thể check-in");
            }
        }
    });

    return {
        ...query,
        createUser: createUserMutation.mutateAsync,
        isCreating: createUserMutation.isPending,
        importUsers: importUsersMutation.mutateAsync,
        isImporting: importUsersMutation.isPending,
        checkInUser: checkInUserMutation.mutateAsync,
        isCheckingIn: checkInUserMutation.isPending,
    };
};
