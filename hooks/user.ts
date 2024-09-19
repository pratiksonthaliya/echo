import { graphqlClient } from "@/clients/api"
import { getCurrentUserQuery, getUserByIdQuery } from "@/graphql/query/user"
import { useQuery } from "@tanstack/react-query"

export const useCurrentUser = () => {
    const query = useQuery({
        queryKey: ["current-user"],
        queryFn: () => graphqlClient.request(getCurrentUserQuery),
        refetchOnWindowFocus: true,  // Ensure data is refetched when the window regains focus
    });

    return {...query, user: query.data?.getCurrentUser};
}

export const useUserbyId = (userId: string) => {
    const query = useQuery({
        queryKey: ["user", userId],
        queryFn: async () => await graphqlClient.request(getUserByIdQuery, {id: userId}),
        enabled: !!userId,
        refetchOnWindowFocus: true,  // Ensure data is refetched when the window regains focus
    });

    return {...query, user: query.data?.getUserById};
}
