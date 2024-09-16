import FeedCard from "@/components/FeedCard";
import EchoLayout from "@/components/Layout/EchoLayout";
import { Post, User } from "@/gql/graphql";
import type { GetServerSideProps, NextPage } from "next";
import Image from "next/image";
import { BsArrowLeftShort } from "react-icons/bs";
import { graphqlClient } from '@/clients/api';
import { getUserByIdQuery } from '@/graphql/query/user';
import Link from 'next/link';
import { useCurrentUser } from '@/hooks/user';
import { useCallback, useEffect, useMemo, useState } from "react";
import { followUserMutation, unFollowUserMutation } from "@/graphql/mutation/user";
import { useQueryClient } from "@tanstack/react-query";
import { RequestDocument } from "graphql-request";
import toast from "react-hot-toast";
import Modal from "@/components/Model";

interface ServerProps {
  userInfo?: User
}

const UserProfilePage: NextPage<ServerProps> = (props) => {
  const { user: currentUser } = useCurrentUser();
  const queryClient = useQueryClient();
  const [followerCount, setFollowerCount] = useState<number>(props?.userInfo?.follower?.length ?? 0);

  const amIFollowing = useMemo(()=>{
    if(!props.userInfo) return false;
    return (currentUser?.following?.findIndex(el => el?.id === props?.userInfo?.id) ?? -1 ) >= 0
  }, [currentUser?.following, props.userInfo]);

  const fetchUpdatedFollowerCount = useCallback(async () => {
    try {
      const { getUserById } = await graphqlClient.request(getUserByIdQuery, { id: props.userInfo?.id as string});
      setFollowerCount(getUserById?.follower?.length || 0); // Update the state with the fresh follower count
    } catch (error) {
      console.error("Error fetching updated follower count:", error);
    }
  }, [props.userInfo?.id]);

  const handleFollowUser = useCallback(async () => {
    if(!currentUser){
      toast.error('Please Login to Follow a User!')
    }
    if (!props.userInfo?.id) return;

    // Optimistically increase follower count
    setFollowerCount((prev) => prev + 1);

    try {
      await graphqlClient.request(followUserMutation as RequestDocument, { to: props.userInfo?.id });

      // Invalidate the current user query to reflect updated following state
      await queryClient.invalidateQueries({ queryKey: ["current-user"], refetchType: "all" });

      // Fetch updated follower count from server
      await fetchUpdatedFollowerCount();
    } catch (error) {
      console.error("Error following user:", error);
      setFollowerCount((prev) => prev - 1); // Revert if error
    }
  }, [currentUser, props.userInfo?.id, queryClient, fetchUpdatedFollowerCount]);

  const handleUnfollowUser = useCallback(async () => {
    if (!props.userInfo?.id) return;

    // Optimistically decrease follower count
    setFollowerCount((prev) => prev - 1);

    try {
      await graphqlClient.request(unFollowUserMutation as RequestDocument, { to: props.userInfo?.id });

      // Invalidate the current user query to reflect updated following state
      await queryClient.invalidateQueries({ queryKey: ["current-user"], refetchType: "all" });

      // Fetch updated follower count from server
      await fetchUpdatedFollowerCount();
    } catch (error) {
      console.error("Error unfollowing user:", error);
      setFollowerCount((prev) => prev + 1); // Revert if error
    }
  }, [props.userInfo?.id, queryClient, fetchUpdatedFollowerCount]);

  useEffect(() => {
    setFollowerCount(props?.userInfo?.follower?.length ?? 0); // Initialize follower count from server-side props
  }, [props?.userInfo?.follower?.length]);

  // const handleFollowUser = useCallback(async () => {
  //   if(!props.userInfo?.id) return;

  //   await graphqlClient.request(followUserMutation as RequestDocument, { to: props.userInfo?.id })
  //   await queryClient.invalidateQueries({ queryKey: ['current-user'], refetchType: 'all' })

  // }, [props.userInfo?.id, queryClient])

  // const handleUnfollowUser = useCallback(async () => {
  //   if(!props.userInfo?.id) return;

  //   await graphqlClient.request(unFollowUserMutation as RequestDocument, { to: props.userInfo?.id })
  //   await queryClient.invalidateQueries({ queryKey: ['current-user'], refetchType: 'all' })
  // }, [props.userInfo?.id, queryClient])

  const [showFollowers, setShowFollowers] = useState(false);  // To manage followers modal
  const [showFollowing, setShowFollowing] = useState(false);  // To manage following modal

  useEffect(() => {
    setFollowerCount(props?.userInfo?.follower?.length ?? 0);
  }, [props?.userInfo?.follower?.length]);

  return (
    <div>
      <EchoLayout>
        <div>
          <nav className="flex items-center gap-3 py-3 px-3">
            <Link href='/'>
              <BsArrowLeftShort className="text-4xl md:text-5xl hover:bg-gray-800 rounded-full p-1 h-fit w-fit cursor-pointer transition-all mb-4"/>
            </Link>
            <div>
                <h1 className="text-xl font-bold">{props?.userInfo?.firstName} {props?.userInfo?.lastName}</h1>
                <h1 className="text-md font-bold text-slate-500">{props?.userInfo?.posts?.length} Posts</h1>
            </div>
          </nav>
          <div className="p-4 border-b border-slate-800 ">
            {props?.userInfo?.profileImageUrl && (
                <Image
                  src={props?.userInfo?.profileImageUrl}
                  alt="user-image"
                  className='rounded-full'
                  height={125}
                  width={125}
                />
            )}
            <h1 className="text-2xl font-bold mt-5">{props?.userInfo?.firstName} {props?.userInfo?.lastName}</h1>
            
            <Modal isOpen={showFollowers} onClose={() => setShowFollowers(false)} title="Followers">
              <ul>
                {props.userInfo?.follower?.map((follower) => (
                  <li key={follower?.id}>{follower?.firstName} {follower?.lastName}</li>
                ))}
              </ul>
            </Modal>

            <Modal isOpen={showFollowing} onClose={() => setShowFollowing(false)} title="Following">
              <ul>
                {props.userInfo?.following?.map((followed) => (
                  <li key={followed?.id}>{followed?.firstName} {followed?.lastName}</li>
                ))}
              </ul>
            </Modal>

            <div className='flex justify-between items-center'>
              <div className='flex gap-4 mt-2 text-sm text-gray-400'>
                {/* <span> {followerCount} followers</span>
                <span> {props.userInfo?.following?.length} following</span> */}
                <button onClick={() => setShowFollowers(true)}>
                  <span> {followerCount} followers</span>
                </button>
                <button onClick={() => setShowFollowing(true)}>
                  <span> {props.userInfo?.following?.length} following</span>
                </button>
              </div>
              {
                currentUser?.id !== props.userInfo?.id && (
                  <>
                    {
                      amIFollowing ? 
                      <button onClick={handleUnfollowUser} className='bg-white text-black py-1 px-3 rounded-full text-sm'>Unfollow</button> 
                      : 
                      <button onClick={handleFollowUser} className='bg-white text-black py-1 px-3 rounded-full text-sm'>Follow</button>
                    }
                  </>
                )
              }
            </div>
          </div>
          <div>
            {props?.userInfo?.posts?.map((post) => <FeedCard data={post as Post} key={post?.id} />)}
          </div>
        </div>
      </EchoLayout>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<ServerProps> = async (context) => {
  const id = context.query.id as string | undefined;
  if(!id) return { notFound: true, props: {userInfo: undefined }}

  const userInfo = await graphqlClient.request(getUserByIdQuery, { id });
  if(!userInfo?.getUserById) return {notFound: true, props: {userInfo: undefined }}

  return {
    props: { userInfo: userInfo.getUserById as User },
  }
}

export default UserProfilePage;