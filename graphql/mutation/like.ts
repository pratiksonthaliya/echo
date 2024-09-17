import { graphql } from "@/gql";

export const toggleLikeMutation  = graphql(`#graphql
    mutation ToggleLike($postId: ID!) {
        toggleLike(postId: $postId) {
            isLiked
            like {
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
    }
`); 