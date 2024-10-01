import { graphqlClient } from "@/clients/api"
import { getCurrentUserQuery, getLikedPostsByUserQuery, getUserByIdQuery } from "@/graphql/query/user"
import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react";

const isClient = typeof window !== 'undefined';

export const useCurrentUser = () => {
    useEffect(() => {
        if (isClient) {
            const token = window.localStorage.getItem('__echo_token') || window.sessionStorage.getItem('__echo_token');
            if (token) {
                graphqlClient.setHeader('Authorization', `Bearer ${token}`);
            }
        }
    }, []);
    const query = useQuery({
        queryKey: ["current-user"],
        queryFn: async () => {
            const token = isClient ? window.localStorage.getItem('__echo_token') || window.sessionStorage.getItem('__echo_token') : null;
            if (!token) {
                throw new Error("Token not found");
            }            
            return await graphqlClient.request(getCurrentUserQuery);
        },
        retry: 1,
        refetchOnWindowFocus: false,  // Disable refetching on window focus
        staleTime: 1000 * 60 * 5,  // Consider data fresh for 5 minutes
    });

    return {...query, user: query.data?.getCurrentUser};
}

export const useUserbyId = (userId: string) => {
    const query = useQuery({
        queryKey: ["user", userId],
        queryFn: async () => await graphqlClient.request(getUserByIdQuery, {id: userId}),
        enabled: !!userId,
        // refetchOnWindowFocus: true,  // Ensure data is refetched when the window regains focus
    });

    return {...query, user: query.data?.getUserById};
}

export const useGetLikedPostByUser = (userId: string) => {
    const query = useQuery({
        queryKey: ["liked-posts", userId],
        queryFn: () => graphqlClient.request(getLikedPostsByUserQuery, {id: userId})
    })

    return {...query, posts: query.data?.getLikedPostsByUser}
}  