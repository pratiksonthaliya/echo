import { Maybe, Comment } from '@/gql/graphql';
import Image from 'next/image';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCurrentUser } from '@/hooks/user';
import { toggleCommentLikeMutation } from '@/graphql/mutation/commentLike';
import { graphqlClient } from '@/clients/api';
import toast from 'react-hot-toast';
import { useCommentLikes } from '@/hooks/commentLike';
import Model from "@/components/LikeModel";
import Link from 'next/link';
import LikeLoader from '../Loaders/LikeLoader';


interface CardProps {
  data: Comment | Partial<Comment>;
}

const handleDate = (createdAt: Maybe<string> | undefined): string => {
  let dateObject: Date | null = null;

  if (createdAt) {
    const timestamp = Number(createdAt);
    if (!isNaN(timestamp) && timestamp.toString().length === 13) {
      // 13 digits for milliseconds (UNIX timestamp in ms)
      dateObject = new Date(timestamp);
    } else {
      dateObject = new Date(createdAt); // Try to parse ISO date string or other valid formats
    }
  }

  return dateObject ? format(dateObject, 'MMM d, h:mm a') : 'Invalid Date or Time';
};

const CommentCard: React.FC<CardProps> = ({ data }) => {
  const comment = data;
  const commentId = comment?.id as string;
  const {user} = useCurrentUser();
  const queryClient = useQueryClient();
  const { data: likeData } = useCommentLikes(commentId);

  const likeCount = likeData?.getCommentLikes?.length ?? 0;
  const isLiked = (likeData?.getCommentLikes?.some((like) => like?.user?.id === user?.id) && likeCount > 0) ?? false;
  const [showUserLiked, setShowUserLiked] = useState(false);  // To manage followers modal

  const [formattedDate, setFormattedDate] = useState<string | null>(null);

  useEffect(() => {
    if (comment?.createdAt) {
      const date = handleDate(comment.createdAt);
      setFormattedDate(date);
    }
  }, [comment?.createdAt]);

  const [isLiking, setIsLiking] = useState(false);

  const likeMutation = useMutation({
    mutationFn: () => graphqlClient.request(toggleCommentLikeMutation, { commentId }),
    onMutate: () => {
      setIsLiking(true);
    },    
    onSuccess: (data) => {
      setIsLiking(false);
      queryClient.invalidateQueries({queryKey: ["comment-likes", commentId], refetchType: 'all'});
      toast.success(data.toggleCommentLike.isLiked ? 'Liked!❤️' : 'Unliked!', { id: '2' });
    },
    onError: (error: Error) => {
      toast.error(`Error: ${error.message}`, { id: '2' });
    },
  });

  const handleCommentLike = () => {
    if(!user || !user?.id){
      toast.error('Please login to Like a Post!');
      return;
    }
    likeMutation.mutate();
  };

  return (
    <div className="comment flex space-x-3 p-6 border-b border-gray-800">
      <div className="flex-shrink-0">
        {comment.user?.profileImageUrl && (
          <Image
            src={comment.user.profileImageUrl}
            alt={`${comment.user.firstName} ${comment.user.lastName}`}
            width={40}
            height={40}
            className="rounded-full"
          />
        )}
      </div>
      <div className="flex-grow">
        <div className="flex items-center">
          <Link href={`/${comment?.user?.id}`}>
          <span className="font-bold mr-2">{comment.user?.firstName} {comment.user?.lastName}</span>
          </Link>
          <span className="text-slate-600 text-sm">· {formattedDate}</span>
        </div>
        <div className="flex items-center justify-between w-fulL text-gray-500 text-sm mr-4">
          <p className="flex-grow text-gray-300">{comment.content}</p>
          <div className="flex gap-2 items-center text-sm">
            <span onClick={handleCommentLike} className="cursor-pointer">
              {/* {isLiked ? <AiFillHeart color="red" /> : <AiOutlineHeart />} */}
              {isLiking ? <LikeLoader isLiked={isLiked}/> : (isLiked ? <AiFillHeart color='red' /> : <AiOutlineHeart />)}

            </span>
            <span onClick={() => setShowUserLiked(true)} className="cursor-pointer">
              {likeCount}
            </span>
          </div>
        </div>
        <Model isOpen={showUserLiked} onClose={() => setShowUserLiked(false)} title="Liked by">
              <ul>
                {likeData?.getCommentLikes?.map((like) => (
                  <button key={like?.id} onClick={() => {
                    setShowUserLiked(false)
                  }}>
                    <div className="flex items-center gap-2 bg-slate-800 rounded-full px-2 py-2 md:px-3 cursor-pointer mb-4 max-w-full">
                      {like?.user?.profileImageUrl && (
                        <Image className="rounded-full flex-shrink-0" src={like?.user?.profileImageUrl} alt="user-image" height={30} width={30} />
                      )}
                      <div className='hidden md:block overflow-hidden'>
                        <h3 className="text-sm lg:text-md truncate">{like?.user?.firstName} {like?.user?.lastName}</h3>
                      </div>
                    </div>
                  </button> 
                ))}
              </ul>
            </Model>
      </div>
    </div>
  );
};

export default CommentCard;
