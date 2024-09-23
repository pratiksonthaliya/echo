import { graphql } from "@/gql";

export const getCommentsByPostQuery = graphql(`#graphql
        
    query GetCommentsByPost($postId: ID!) {
        getCommentsByPost(postId: $postId) {
            content
            createdAt
            id
            user {
                firstName
                lastName
                id
                profileImageUrl
            }
        }
    }
`); 



