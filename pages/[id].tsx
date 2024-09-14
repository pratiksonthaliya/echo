import { useRouter } from 'next/router'
import FeedCard from "@/components/FeedCard";
import EchoLayout from "@/components/Layout/EchoLayout";
import { Post, User } from "@/gql/graphql";
import type { GetServerSideProps, NextPage } from "next";
import Image from "next/image";
import { BsArrowLeftShort } from "react-icons/bs";
import { graphqlClient } from '@/clients/api';
import { getUserByIdQuery } from '@/graphql/query/user';
import Link from 'next/link';

interface ServerProps {
  userInfo?: User
}

const UserProfilePage: NextPage<ServerProps> = (props) => {
  const router = useRouter();
  console.log(router.query);
  // console.log(props);

  return (
    <div>
      <EchoLayout>
        <div>
          <nav className="flex items-center gap-3 py-3 px-3">
            <Link href='/'>
              <BsArrowLeftShort className="text-4xl"/>
            </Link>
            <div>
                <h1 className="text- xl font-bold">{props?.userInfo?.firstName} {props?.userInfo?.lastName}</h1>
                <h1 className="text-md font-bold text-slate-500">{props?.userInfo?.posts?.length} Posts</h1>
            </div>
          </nav>
          <div className="p-4 border-b border-slate-800 ">
            {props?.userInfo?.profileImageUrl && (
                <Image
                  src={props?.userInfo?.profileImageUrl}
                  alt="user-image"
                  className='rounded-full'
                  height={100}
                  width={100}
                />
            )}
            <h1 className="text-2xl font-bold mt-5">{props?.userInfo?.firstName} {props?.userInfo?.lastName}</h1>
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