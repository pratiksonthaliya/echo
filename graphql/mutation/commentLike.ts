import { graphql } from "@/gql";

export const toggleCommentLikeMutation  = graphql(`#graphql
    mutation ToggleCommentLike($commentId: ID!) {
        toggleCommentLike(commentId: $commentId) {
            isLiked
            commentLike {
                id
                comment {
                    id
                    content
                    createdAt
                }
                user {
                    id
                    firstName
                    lastName
                    email
                    profileImageUrl
                }
            }
        }
    }
`); 