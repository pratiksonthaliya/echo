import { graphql } from "@/gql";

export const getPostLikesQuery = graphql(`#graphql
        
    query GetPostLikes($postId: ID!) {
        getPostLikes(postId: $postId) {
            id
            post {
                id
                content
                imageURL
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

