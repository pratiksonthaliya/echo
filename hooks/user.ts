import { graphqlClient } from "@/clients/api"
import { getCurrentUserQuery } from "@/graphql/query/user"
import { useQuery } from "@tanstack/react-query"
// import toast from "react-hot-toast"

export const useCurrentUser = () => {
    const query = useQuery({
        queryKey: ["current-user"],
        queryFn: () => graphqlClient.request(getCurrentUserQuery)
    })

    return {...query, user: query.data?.getCurrentUser}
}

// export const useGetFollowers = () => {
//     const queryClient = useQueryClient();

//     const mutation = useMutation({
//         // mutationKey: ["get-followers"],
//         mutationFn: async (to: string) => await graphqlClient.request(FollowUserDocument, {to}),
//         onMutate: () => toast.loading('Following', {id: '3'}),
//         onSuccess: async () => {
//             await queryClient.invalidateQueries({ queryKey: ['current-user'], refetchType: 'all' });
//             await queryClient.invalidateQueries({ queryKey: ['get-followers'], refetchType: 'all' });
//             toast.success('Followed', {id: '3'})
//         } 
//     })

//     return mutation;
// }