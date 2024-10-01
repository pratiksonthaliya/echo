import FeedCard from "@/components/FeedCard";
import EchoLayout from "@/components/Layout/EchoLayout";
import { Post, User } from "@/gql/graphql";
import type { GetServerSideProps, NextPage } from "next";
import Image from "next/image";
import { BsArrowLeftShort } from "react-icons/bs";
import { graphqlClient } from '@/clients/api';
import { getUserByIdQuery } from '@/graphql/query/user';
import Link from 'next/link';
import { useCurrentUser, useUserbyId } from '@/hooks/user';
import { useCallback, useEffect, useState } from "react";
import { followUserMutation, unFollowUserMutation } from "@/graphql/mutation/user";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import Model from "@/components/FollowModel";
import debounce from 'lodash.debounce';


interface ServerProps {
  userInfo?: User
}

const UserProfilePage: NextPage<ServerProps> = (props) => {
  const userInfo = useUserbyId(props?.userInfo?.id as string)?.data?.getUserById;
  const router = useRouter();
  const { user: currentUser } = useCurrentUser();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [followerCount, setFollowerCount] = useState<number>(props?.userInfo?.follower?.length ?? 0);
  const [amIFollowing, setAmIFollowing] = useState<boolean>(false);

  useEffect(() => {
    if (currentUser && userInfo?.id) {
      setAmIFollowing(currentUser?.following?.some((el) => el?.id === userInfo?.id) ?? false);
    }
  }, [currentUser, userInfo?.id]);

  // const amIFollowing = useMemo(()=>{
  //   if(!currentUser ) return false;
  //   return (currentUser?.following?.some(el => el?.id === props?.userInfo?.id) )
  // }, [currentUser, props?.userInfo?.id]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateFollowStatus = useCallback(
    debounce(async (isFollow: boolean) => {
      if (!currentUser) {
        toast.error("Please login to follow/unfollow!");
        return;
      }
      if (!props?.userInfo?.id || loading) return; // Prevent further clicks when loading

      setLoading(true);  // Set loading to true
      setAmIFollowing(isFollow);
      setFollowerCount((prev) => prev + (isFollow ? 1 : -1));

      try {
        const mutation = isFollow ? followUserMutation : unFollowUserMutation;
        await graphqlClient.request(mutation, { to: userInfo?.id as string });

        await queryClient.invalidateQueries({ queryKey: ["current-user"], refetchType: "all" });
        await queryClient.invalidateQueries({ queryKey: ["user", userInfo?.id], refetchType: "all" });

        toast.success(`${isFollow ? "Followed" : "Unfollowed"} successfully!`);

      } catch (error) {
        setFollowerCount((prev) => prev + (isFollow ? -1 : 1));  // Rollback follower count in case of error
        setAmIFollowing(!isFollow);
        toast.error(`Failed to ${isFollow ? "follow" : "unfollow"}. Please try again.`);
      } 
      finally {
        setLoading(false);  // Reset loading
      }
    }, 150),  // Debounce delay
    [currentUser, queryClient, userInfo?.id, loading]
  );

  const [showFollowers, setShowFollowers] = useState(false);  // To manage followers modal
  const [showFollowing, setShowFollowing] = useState(false);  // To manage following modal

  if(!props?.userInfo || !props?.userInfo?.id){
    return <div>
      <EchoLayout>
        <div></div>
      </EchoLayout>
    </div>
  }

  return (
    <div>
      <EchoLayout>
        <div>
          <nav className="flex items-center gap-3 py-3 px-3">
            <Link href='/'>
              <BsArrowLeftShort className="text-4xl md:text-5xl hover:bg-gray-800 rounded-full p-1 h-fit w-fit cursor-pointer transition-all mb-4"/>
            </Link>
            <div>
                <h1 className="text-xl font-bold">{userInfo?.firstName} {userInfo?.lastName}</h1>
                <h1 className="text-md font-bold text-slate-500">{userInfo?.posts?.length} Posts</h1>
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
            <h1 className="text-2xl font-bold mt-5">{userInfo?.firstName} {userInfo?.lastName}</h1>
            <Model isOpen={showFollowers} onClose={() => setShowFollowers(false)} title="Followers">
              <ul>
                {userInfo?.follower?.map((follower) => (
                  <button key={follower?.id} onClick={() => {
                    setShowFollowers(false)
                    router.push(`/${follower?.id}`);
                  }}>
                    <div className="flex items-center gap-2 bg-slate-800 rounded-full px-2 py-2 md:px-3 cursor-pointer mb-4 max-w-full">
                      {follower?.profileImageUrl && (
                        <Image className="rounded-full flex-shrink-0" src={follower?.profileImageUrl} alt="user-image" height={30} width={30} />
                      )}
                      <div className='hidden md:block overflow-hidden'>
                        <h3 className="text-sm lg:text-md truncate">{follower?.firstName} {follower?.lastName}</h3>
                      </div>
                    </div>
                  </button> 
                ))}
              </ul>
            </Model>

            <Model isOpen={showFollowing} onClose={() => setShowFollowing(false)} title="Following">
              <ul>
                {props.userInfo?.following?.map((followed) => (
                  <button key={followed?.id} onClick={() => {
                    setShowFollowing(false)
                    router.push(`/${followed?.id}`);
                  }}>
                    <div className="flex items-center gap-2 bg-slate-800 rounded-full px-2 py-2 md:px-3 cursor-pointer mb-4 max-w-full">
                      {followed?.profileImageUrl && (
                        <Image className="rounded-full flex-shrink-0" src={followed?.profileImageUrl} alt="user-image" height={30} width={30} />
                      )}
                      <div className='hidden md:block overflow-hidden'>
                        <h3 className="text-sm lg:text-md truncate">{followed?.firstName} {followed?.lastName}</h3>
                      </div>
                    </div>
                  </button> 
                ))}
              </ul>
            </Model>
            <div className='flex justify-between items-center'>
              <div className='cursor-pointer flex gap-4 mt-2 text-sm text-gray-400'>
                <span onClick={() => setShowFollowers(true)} > {followerCount} followers</span>
                <span onClick={() => setShowFollowing(true)} >{userInfo?.following?.length} following</span>
              </div>
              {
                currentUser?.id !== props.userInfo?.id && (
                  <button
                    onClick={() => updateFollowStatus(!amIFollowing)}
                    className="bg-white text-black py-1 px-3 rounded-full text-sm"
                  >
                    {amIFollowing ? "Unfollow" : "Follow"}
                  </button>
                )
              }
            </div>
          </div>
          <div>
            {props?.userInfo?.posts?.length ?
                  props?.userInfo?.posts?.map((post) => (
                    <FeedCard data={post as Post} key={post?.id} /> // Reuse FeedCard component
                )) : <p className="text-gray-500 text-center">Post something to see here</p>
            }
          </div>
        </div>
      </EchoLayout>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<ServerProps> = async (context) => {
  try {
    const id = context.query.id as string | undefined;
    if(!id) return { notFound: true, props: {userInfo: undefined }}
    const userInfo = await graphqlClient.request(getUserByIdQuery, { id });
    if(!userInfo?.getUserById) return {notFound: true, props: {userInfo: undefined }}

    return {
      props: { userInfo: userInfo.getUserById as User },
    }
  } catch (error) {
    return {
      props: { userInfo: {} as User }, // Or you could return { notFound: true }
    };
  }
}

export default UserProfilePage;
