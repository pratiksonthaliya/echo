import { GraphQLClient } from 'graphql-request'

const isClient = typeof window !== 'undefined';

export const graphqlClient = new GraphQLClient(process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}` : 'http://localhost:8000/graphql',
    {
    headers: () => ({
        Authorization: isClient ? `Bearer ${window.localStorage.getItem("__echo_token")}` : '',
        'Content-Type': 'application/json',
    })
});