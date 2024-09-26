import { graphql } from "@/gql";

export const getCommentLikesQuery = graphql(`#graphql
    query GetCommentLikes($commentId: ID!) {
        getCommentLikes(commentId: $commentId) {
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
`); 

