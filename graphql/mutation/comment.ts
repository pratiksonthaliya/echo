import { graphql } from "@/gql";

export const addCommentMutation = graphql(`#graphql
    mutation AddComment($postId: ID!, $content: String!) {
        addComment(postId: $postId, content: $content) {
            content
            createdAt
            id
            user {
                profileImageUrl
                lastName
                firstName
                id
            }
        }
    }
`); 