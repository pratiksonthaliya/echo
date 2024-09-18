import { graphql } from "@/gql";

export const toggleBookmarkMutation  = graphql(`#graphql
    mutation ToggleBookmark($postId: ID!) {
        toggleBookmark(postId: $postId) {
            isBookmarked
            bookmark {
                id
                post {
                    id
                    content
                    imageURL
                    createdAt
                }
                user {
                    id
                    email
                    firstName
                    lastName
                    profileImageUrl
                }
            }
        }
    }
`); 

