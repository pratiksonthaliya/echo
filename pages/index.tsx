import { useCallback, useState } from "react";
import { useCurrentUser } from "@/hooks/user";
import { Post } from "@/gql/graphql";
import EchoLayout from "@/components/Layout/EchoLayout";
import { BiImageAlt } from "react-icons/bi";
import FeedCard from "@/components/FeedCard";
import Image from "next/image";
import { GetServerSideProps } from "next";
import { graphqlClient } from "@/clients/api";
import { getAllPostsQuery } from "@/graphql/query/post";
import { useCreatePost } from "@/hooks/post";

interface HomeProps {
  posts?: Post[]
}
 
export default function Home(props: HomeProps) {

  const { user } = useCurrentUser();  
  const { mutate } = useCreatePost();

  const [content, setContent] = useState("")

  const  handleCreatePost = useCallback(() => {
    mutate({
      content,
    })
    setContent("")
  }, [content, mutate])

  const handleSelectImage = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file'); 
    input.setAttribute('accept', 'image/*');
    input.click();
  }, []);

  return (
    <div>
      <EchoLayout>
      <div>
        <div className=' p-5 border-t-[0.5px] border-gray-700 hover:bg-gray-900 transition-all cursor-pointer '>
          <div className='grid grid-cols-12 gap-2'>
            <div className='col-span-1 gap-3'>
              {user?.profileImageUrl &&
              <Image alt="user-image" src={user?.profileImageUrl} height={50} width={50} className='rounded-full' />}
            </div>
            <div className="col-span-11 ">
              <textarea value={content} onChange={e => setContent(e.target.value)} className="w-full bg-transparent text-xl px-3 border-b border-slate-700" rows={3} placeholder="What's happening?" name="" id=""></textarea>
              <div className="mt-2 flex justify-between items-center">
                <BiImageAlt onClick={handleSelectImage} className="text-2xl"/>
                <button onClick={handleCreatePost} className="py-2 px-4 bg-[#1d9bf0] font-semibold text-sm rounded-full mx-50">Post</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      { 
        props?.posts && props?.posts?.map((post) => post ? <FeedCard key={post?.id} data={post as Post} /> : null )
      }
    </EchoLayout>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  const allPosts = await graphqlClient.request(getAllPostsQuery);
  return {
    props: {
      posts: allPosts.getAllPosts as Post[],
    }
  }
}