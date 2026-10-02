import { useQuery } from "@tanstack/react-query";
import { starredService } from "@/services/starred/starred.service";

export const useGetStarred = () => {
    return useQuery({
        queryKey: ["starred"],
        queryFn: starredService.getStarred,
    });
};