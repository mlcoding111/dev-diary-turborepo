import { fetchMe } from "@/api/auth";
import { useQuery } from "@tanstack/react-query";
import type { QueryOptions } from "@tanstack/react-query";

export const userKeys = {
    all: ['users'] as const,
    lists: () => [...userKeys.all, 'list'] as const,
    list: () => [...userKeys.lists()] as const,
    details: () => [...userKeys.all, 'detail'] as const,
    detail: (id: string) => [...userKeys.details(), id] as const,
    me: ['me'] as const,
}

export const useUsers = () => {
    return useQuery({ queryKey: userKeys.all, queryFn: fetchMe })
}

export const useUser = (id: string) => {
    return useQuery({ queryKey: userKeys.detail(id), queryFn: fetchMe })
}

export const useUsersLists = () => {
    return useQuery({ queryKey: userKeys.lists(), queryFn: fetchMe })
}

export const useMe = (queryOptions?: QueryOptions) => {
    return useQuery({ queryKey: userKeys.me, queryFn: fetchMe, ...queryOptions })
}

