import { useState } from 'react'
import { NextPage } from 'next'
import EchoLayout from '@/components/Layout/EchoLayout'
import { useRouter } from 'next/router'
import FeedCard from '@/components/FeedCard'
import { Post } from '@/gql/graphql'
import Image from 'next/image';
import { usePostComments } from '@/hooks/comment'
import { useCurrentUser } from '@/hooks/user'
import { BsArrowLeftShort } from 'react-icons/bs'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { graphqlClient } from '@/clients/api'
import { addCommentMutation } from '@/graphql/mutation/comment'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import CommentCard from '@/components/CommentCard'

const PostPage: NextPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const user = useCurrentUser().data?.getCurrentUser;  
  const postData = typeof router.query.postData === 'string' ? JSON.parse(router.query.postData) : null;
  const { data: commentData } = usePostComments(postData?.id as string);

  const [newComment, setNewComment] = useState("");

  const commentMutation = useMutation({
    mutationFn: () => graphqlClient.request(addCommentMutation, { postId: postData?.id, content: newComment }),
    // onMutate: () =>  toast.custom('❤️', { id: '2'}, ),
    onSuccess: () => {
      setNewComment('');
      queryClient.invalidateQueries({queryKey: ["post-comments", postData?.id], refetchType: 'all'});
      toast.success('comment added', { id: '2' });
    },
    onError: (error: Error) => {
      toast.error(`Error: ${error.message}`, { id: '2' });
    },
  });

  const handleCreateComment = () => {
    if(!user || !user?.id){
      toast.error('Please login to Comment!');
      return;
    }
    commentMutation.mutate();
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <EchoLayout>
        <div className="max-w-2xl mx-auto">
          <nav className="flex items-center gap-3 py-3 px-3 border-b border-gray-800">
            <Link href='/'>
              <BsArrowLeftShort className="text-4xl md:text-5xl hover:bg-gray-800 rounded-full p-1 h-fit w-fit cursor-pointer transition-all"/>
            </Link>
            <div>
              <h1 className="text-xl font-bold">Post</h1>
            </div>
          </nav>

          <div className="border-b border-gray-800">
            <FeedCard key={postData?.id} data={postData as Post} />
          </div>

          <div className="p-4 border-gray-800">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                {user?.profileImageUrl && (
                  <Image 
                    alt="user-image" 
                    src={user.profileImageUrl} 
                    height={40} 
                    width={40} 
                    className="rounded-full gap-x-2"
                  />
                )}
              </div>
              <div className="flex-grow">
                <textarea 
                  value={newComment} 
                  onChange={e => setNewComment(e.target.value)} 
                  className="w-full bg-transparent text-lg px-3 py-2 border-b border-gray-700 focus:outline-none focus:border-blue-500 resize-none" 
                  rows={3} 
                  placeholder="Post your reply"
                />
                <div className="mt-2 flex justify-end">
                  <button 
                    onClick={handleCreateComment} 
                    className="py-2 px-4 bg-blue-500 text-white font-semibold text-sm rounded-full hover:bg-blue-600 transition duration-200"
                  >
                    Reply
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="comments-section  px-4">
            {commentData?.getCommentsByPost?.length !== 0 ? (
              <div>
                <h2 className="text-xl font-bold mb-4">Comments</h2>
                {commentData?.getCommentsByPost?.map((comment) => (
                  <CommentCard key={comment?.id} data={comment} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No comments yet</p>
            )}
          </div>
        </div>
      </EchoLayout>
    </div>
  )
};

// export const getServerSideProps: GetServerSideProps<ServerProps> = async (context) => {
//     const id = context.query.id as string | undefined;
//     if(!id) return { notFound: true, props: {userInfo: undefined }}
    
//     try {
//         const postInfo = await graphqlClient.request(getPostByIdQuery, { id });
//         if(!postInfo?.getPostById) return {notFound: true, props: {postInfo: undefined }}
        
//         return {
//             props: { postInfo: postInfo.getPostById as Post },
//         }
//     } catch (error) {
//         return {
//             props: { postInfo: {} as Post }, // Or you could return { notFound: true }
//         };
//     }
// }

export default PostPage;