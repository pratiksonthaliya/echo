import { graphqlClient } from "@/clients/api"
import { getCommentsByPostQuery } from "@/graphql/query/comment"
import { useQuery } from "@tanstack/react-query"

export const usePostComments = (postId: string) => {
    const query = useQuery({
        queryKey: ["post-comments", postId],
        queryFn: async () => await graphqlClient.request(getCommentsByPostQuery, { postId })
    })

    return {...query, user: query.data?.getCommentsByPost}
}
