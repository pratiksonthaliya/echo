import { graphql } from "../../gql";

export const getAllPostsQuery = graphql(`#graphql
    query GetAllPosts {
        getAllPosts {
            id
            content
            imageURL
            createdAt
            author {
                id
                firstName
                lastName
                profileImageUrl
            }
        }
    } 
`); 

export const getSignedURLForPostQuery = graphql(`#graphql
    query GetSignedURL($imageName: String!, $imageType: String!) {
        getSignedURLForPost(imageName: $imageName, imageType: $imageType)
    }
`)