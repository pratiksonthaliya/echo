/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "#graphql\n    mutation ToggleLike($postId: ID!) {\n        toggleLike(postId: $postId) {\n            isLiked\n            like {\n                id\n                post {\n                    id\n                    content\n                    imageURL\n                    createdAt\n                }\n                user {\n                    id\n                    firstName\n                    lastName\n                    email\n                    profileImageUrl\n                }\n            }\n        }\n    }\n": types.ToggleLikeDocument,
    "#graphql\n    mutation createPost($payload: CreatePostData!) {\n        createPost(payload: $payload ) {\n            id\n        }\n    } \n": types.CreatePostDocument,
    "#graphql\n    mutation FollowUser($to: ID!){\n        followUser(to: $to)\n    }\n": types.FollowUserDocument,
    "#graphql\n    mutation UnFollowUser($to: ID!) {\n        unFollowUser(to: $to)\n    } \n": types.UnFollowUserDocument,
    "#graphql\n        \n    query GetPostLikes($postId: ID!) {\n        getPostLikes(postId: $postId) {\n            id\n            post {\n                id\n                content\n                imageURL\n                createdAt\n            }\n            user {\n                id\n                firstName\n                lastName\n                email\n                profileImageUrl\n            }\n        }\n    }\n": types.GetPostLikesDocument,
    "#graphql\n    query GetAllPosts {\n        getAllPosts {\n            id\n            content\n            imageURL\n            createdAt\n            author {\n                id\n                firstName\n                lastName\n                profileImageUrl\n            }\n        }\n    } \n": types.GetAllPostsDocument,
    "#graphql\n    query GetSignedURL($imageName: String!, $imageType: String!) {\n        getSignedURLForPost(imageName: $imageName, imageType: $imageType)\n    }\n": types.GetSignedUrlDocument,
    "#graphql\n    query VerifyUserGoogleToken($token: String!){\n        verifyGoogleToken(token: $token)\n    }\n": types.VerifyUserGoogleTokenDocument,
    "#graphql\n    query GetCurrentUser {\n        getCurrentUser {\n            id\n            email\n            firstName\n            lastName\n            profileImageUrl\n            recommendedUsers {\n                id\n                firstName\n                lastName\n                profileImageUrl\n            }\n            follower {\n                id\n                firstName\n                lastName\n                profileImageUrl\n            }\n            following {\n                id\n                firstName\n                lastName\n                profileImageUrl\n            }\n            posts {\n                id\n                content\n                createdAt\n                author {\n                    id\n                    firstName\n                    lastName\n                    profileImageUrl\n                }\n            }\n        }\n    }\n": types.GetCurrentUserDocument,
    "#graphql\n    query GetUserById($id: ID!) {\n        getUserById(id: $id) {\n            id\n            firstName\n            lastName\n            profileImageUrl\n            follower {\n                id\n                firstName\n                lastName\n                profileImageUrl\n            }\n            following {\n                id\n                firstName\n                lastName\n                profileImageUrl\n            }\n            posts {\n                id\n                content\n                createdAt\n                author {\n                    id\n                    firstName\n                    lastName\n                    profileImageUrl\n                }\n            }\n        }\n    }\n": types.GetUserByIdDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "#graphql\n    mutation ToggleLike($postId: ID!) {\n        toggleLike(postId: $postId) {\n            isLiked\n            like {\n                id\n                post {\n                    id\n                    content\n                    imageURL\n                    createdAt\n                }\n                user {\n                    id\n                    firstName\n                    lastName\n                    email\n                    profileImageUrl\n                }\n            }\n        }\n    }\n"): (typeof documents)["#graphql\n    mutation ToggleLike($postId: ID!) {\n        toggleLike(postId: $postId) {\n            isLiked\n            like {\n                id\n                post {\n                    id\n                    content\n                    imageURL\n                    createdAt\n                }\n                user {\n                    id\n                    firstName\n                    lastName\n                    email\n                    profileImageUrl\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "#graphql\n    mutation createPost($payload: CreatePostData!) {\n        createPost(payload: $payload ) {\n            id\n        }\n    } \n"): (typeof documents)["#graphql\n    mutation createPost($payload: CreatePostData!) {\n        createPost(payload: $payload ) {\n            id\n        }\n    } \n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "#graphql\n    mutation FollowUser($to: ID!){\n        followUser(to: $to)\n    }\n"): (typeof documents)["#graphql\n    mutation FollowUser($to: ID!){\n        followUser(to: $to)\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "#graphql\n    mutation UnFollowUser($to: ID!) {\n        unFollowUser(to: $to)\n    } \n"): (typeof documents)["#graphql\n    mutation UnFollowUser($to: ID!) {\n        unFollowUser(to: $to)\n    } \n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "#graphql\n        \n    query GetPostLikes($postId: ID!) {\n        getPostLikes(postId: $postId) {\n            id\n            post {\n                id\n                content\n                imageURL\n                createdAt\n            }\n            user {\n                id\n                firstName\n                lastName\n                email\n                profileImageUrl\n            }\n        }\n    }\n"): (typeof documents)["#graphql\n        \n    query GetPostLikes($postId: ID!) {\n        getPostLikes(postId: $postId) {\n            id\n            post {\n                id\n                content\n                imageURL\n                createdAt\n            }\n            user {\n                id\n                firstName\n                lastName\n                email\n                profileImageUrl\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "#graphql\n    query GetAllPosts {\n        getAllPosts {\n            id\n            content\n            imageURL\n            createdAt\n            author {\n                id\n                firstName\n                lastName\n                profileImageUrl\n            }\n        }\n    } \n"): (typeof documents)["#graphql\n    query GetAllPosts {\n        getAllPosts {\n            id\n            content\n            imageURL\n            createdAt\n            author {\n                id\n                firstName\n                lastName\n                profileImageUrl\n            }\n        }\n    } \n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "#graphql\n    query GetSignedURL($imageName: String!, $imageType: String!) {\n        getSignedURLForPost(imageName: $imageName, imageType: $imageType)\n    }\n"): (typeof documents)["#graphql\n    query GetSignedURL($imageName: String!, $imageType: String!) {\n        getSignedURLForPost(imageName: $imageName, imageType: $imageType)\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "#graphql\n    query VerifyUserGoogleToken($token: String!){\n        verifyGoogleToken(token: $token)\n    }\n"): (typeof documents)["#graphql\n    query VerifyUserGoogleToken($token: String!){\n        verifyGoogleToken(token: $token)\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "#graphql\n    query GetCurrentUser {\n        getCurrentUser {\n            id\n            email\n            firstName\n            lastName\n            profileImageUrl\n            recommendedUsers {\n                id\n                firstName\n                lastName\n                profileImageUrl\n            }\n            follower {\n                id\n                firstName\n                lastName\n                profileImageUrl\n            }\n            following {\n                id\n                firstName\n                lastName\n                profileImageUrl\n            }\n            posts {\n                id\n                content\n                createdAt\n                author {\n                    id\n                    firstName\n                    lastName\n                    profileImageUrl\n                }\n            }\n        }\n    }\n"): (typeof documents)["#graphql\n    query GetCurrentUser {\n        getCurrentUser {\n            id\n            email\n            firstName\n            lastName\n            profileImageUrl\n            recommendedUsers {\n                id\n                firstName\n                lastName\n                profileImageUrl\n            }\n            follower {\n                id\n                firstName\n                lastName\n                profileImageUrl\n            }\n            following {\n                id\n                firstName\n                lastName\n                profileImageUrl\n            }\n            posts {\n                id\n                content\n                createdAt\n                author {\n                    id\n                    firstName\n                    lastName\n                    profileImageUrl\n                }\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "#graphql\n    query GetUserById($id: ID!) {\n        getUserById(id: $id) {\n            id\n            firstName\n            lastName\n            profileImageUrl\n            follower {\n                id\n                firstName\n                lastName\n                profileImageUrl\n            }\n            following {\n                id\n                firstName\n                lastName\n                profileImageUrl\n            }\n            posts {\n                id\n                content\n                createdAt\n                author {\n                    id\n                    firstName\n                    lastName\n                    profileImageUrl\n                }\n            }\n        }\n    }\n"): (typeof documents)["#graphql\n    query GetUserById($id: ID!) {\n        getUserById(id: $id) {\n            id\n            firstName\n            lastName\n            profileImageUrl\n            follower {\n                id\n                firstName\n                lastName\n                profileImageUrl\n            }\n            following {\n                id\n                firstName\n                lastName\n                profileImageUrl\n            }\n            posts {\n                id\n                content\n                createdAt\n                author {\n                    id\n                    firstName\n                    lastName\n                    profileImageUrl\n                }\n            }\n        }\n    }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;