import { graphql } from "@/gql";

export const getUserBookmarksQuery = graphql(`#graphql
    query GetUserBookmarks($userId: ID!) {
        getUserBookmarks(userId: $userId) {
            id
            post {
                id
                content
                imageURL
                createdAt
                author {
                    id
                    email
                    firstName
                    lastName
                    profileImageUrl
                }
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
`); 

