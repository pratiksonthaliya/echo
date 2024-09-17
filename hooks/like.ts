import { graphqlClient } from "@/clients/api"
import { getPostLikesQuery } from "@/graphql/query/like"
import { useQuery } from "@tanstack/react-query"

export const usePostLikes = (postId: string) => {
    const query = useQuery({
        queryKey: ["post-likes", postId],
        queryFn: async () => await graphqlClient.request(getPostLikesQuery, { postId })
    })

    return {...query, user: query.data?.getPostLikes}
}