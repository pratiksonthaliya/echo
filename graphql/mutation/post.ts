import { graphql } from "@/gql";

export const createPostMutation  = graphql(`#graphql
    mutation createPost($payload: CreatePostData!) {
        createPost(payload: $payload ) {
            id
        }
    } 
`); 