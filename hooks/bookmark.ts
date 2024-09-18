import { graphqlClient } from "@/clients/api"
import { getUserBookmarksQuery } from "@/graphql/query/bookmark"
import { useQuery } from "@tanstack/react-query"

export const useUserBookmarks = (userId: string) => {
    const query = useQuery({
        queryKey: ["add-bookmark", userId],
        queryFn: async () => await graphqlClient.request(getUserBookmarksQuery, { userId })
    })

    return {...query, user: query.data?.getUserBookmarks}
}