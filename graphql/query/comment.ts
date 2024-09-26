import { graphql } from "@/gql";

export const getCommentsByPostQuery = graphql(`#graphql
        
    query GetCommentsByPost($postId: ID!) {
        getCommentsByPost(postId: $postId) {
            id
            content
            createdAt
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



