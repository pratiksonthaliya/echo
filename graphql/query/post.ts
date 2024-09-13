import { graphql } from "../../gql";

export const getAllPostsQuery = graphql(`#graphql
    query GetAllPosts {
        getAllPosts {
            id
            content
            imageURL
            author {
                id
                firstName
                lastName
                profileImageUrl
            }
        }
    } 
`); 