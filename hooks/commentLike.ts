import { graphqlClient } from "@/clients/api"
import { getCommentLikesQuery } from "@/graphql/query/commentLike"
import { useQuery } from "@tanstack/react-query"

export const useCommentLikes = (commentId: string) => {
    const query = useQuery({
        queryKey: ["comment-likes", commentId],
        queryFn: async () => await graphqlClient.request(getCommentLikesQuery, { commentId })
    })

    return {...query, user: query.data?.getCommentLikes}
}