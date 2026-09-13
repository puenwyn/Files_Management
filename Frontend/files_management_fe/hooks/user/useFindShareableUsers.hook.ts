import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { userService } from "@/services/user/user.service";
import { ShareableUserResponse } from "@/schemas/user/shareable-user-response.schema";

export const useFindShareableUsers = () => {
    const [keyword, setKeyword] = useState("");
    const [selectedUser, setSelectedUser] =
        useState<ShareableUserResponse | null>(null);

    const [debouncedKeyword, setDebouncedKeyword] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedKeyword(keyword.trim());
        }, 400);

        return () => clearTimeout(timer);
    }, [keyword]);

    const query = useQuery({
        queryKey: ["shareable-users", debouncedKeyword],
        queryFn: () =>
            userService.findShareableUsers(
                debouncedKeyword || undefined,
            ),
    });

    const handleKeywordChange = (value: string) => {
        setKeyword(value);
        setSelectedUser(null);
    };

    const handleUserSelect = (user: ShareableUserResponse) => {
        setSelectedUser(user);
        setKeyword(user.email);
    };

    const clearSelectedUser = () => {
        setSelectedUser(null);
        setKeyword("");
    };

    return {
        keyword,
        users: query.data ?? [],
        selectedUser,

        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isError: query.isError,
        error: query.error,

        setKeyword: handleKeywordChange,
        selectUser: handleUserSelect,
        clearSelectedUser,
    };
};
