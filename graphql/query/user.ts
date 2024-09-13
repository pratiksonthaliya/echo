import { graphql } from '@/gql';

export const verifyUserGoogleTokenQuery = graphql(`#graphql
    query VerifyUserGoogleToken($token: String!){
        verifyGoogleToken(token: $token)
    }
`); 

export const getCurrentUserQuery = graphql(`#graphql
    query GetCurrentUser {
        getCurrentUser {
            id
            email
            firstName
            lastName
            profileImageUrl
            posts {
                id
                content
                author {
                    id
                    firstName
                    lastName
                    profileImageUrl
                }
            }
        }
    }
`)
export const getUserByIdQuery = graphql(`#graphql
    query GetUserById($id: ID!) {
        getUserById(id: $id) {
            id
            firstName
            lastName
            profileImageUrl
            posts {
                id
                content
                author {
                    id
                    firstName
                    lastName
                    profileImageUrl
                }
            }
        }
    }
`)
