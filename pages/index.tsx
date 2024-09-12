import { SlOptions } from "react-icons/sl";
import { LiaTeamspeak } from "react-icons/lia";
import { BiBell, BiBookmark, BiEnvelope, BiHash, BiImageAlt, BiSolidHome, BiUser } from "react-icons/bi";

import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import FeedCard from "@/components/FeedCard";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { graphqlClient } from "@/clients/api";
import { verifyUserGoogleTokenQuery } from "@/graphql/query/user";
import { useCurrentUser } from "@/hooks/user";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useCreatePost, useGetAllPosts } from "@/hooks/post";
import { Post } from "@/gql/graphql";
 
interface EchoSideButton {
  title: string,
  icon: React.ReactNode
}

const sideBarMenuItems: EchoSideButton[]= [
   {
    title: 'Home',
     icon:  <BiSolidHome />
   },
   {
    title: 'Explore',
     icon:  <BiHash />
   },
   {
    title: 'Notifications',
     icon:  <BiBell />
   },
   {
    title: 'Messages',
     icon:  <BiEnvelope />
   },
   {
    title: 'Bookmarks',
     icon:  <BiBookmark />
   },
   {
    title: 'Profile',
     icon:  <BiUser />
   },
   {
    title: 'More Options',
    icon: <SlOptions />
   }
]

export default function Home() {

  const { user } = useCurrentUser();  
  const { posts = []} = useGetAllPosts();
  const { mutate } = useCreatePost();

  const queryClient = useQueryClient();

  const [content, setContent] = useState("")

  const  handleCreatePost = useCallback(() => {
    mutate({
      content,
    })
    setContent("")
  }, [content, mutate])

  const handleLoginWithGoogle = useCallback( async (credentialResponse: CredentialResponse) => {
    const googleToken = credentialResponse.credential;

    if(!googleToken) return toast.error(`Google Token Not Found`);

    try {
      const { verifyGoogleToken }  = await graphqlClient.request(verifyUserGoogleTokenQuery, {token: googleToken});

      toast.success(`Verified Successful`) 
      console.log(verifyGoogleToken);
      
      if(verifyGoogleToken) window.localStorage.setItem('__echo_token', verifyGoogleToken);

      await queryClient.invalidateQueries({ queryKey: ['current-user'], refetchType: 'all' });

    } catch (error) {
      return toast.error(`Google Token Not Found`);
    }

  }, [queryClient]);

  const handleSelectImage = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file'); 
    input.setAttribute('accept', 'image/*');
    input.click();
  }, []);

  return (
    <div>
      <div className="grid grid-cols-12 h-screen w-screen">
        <div className="col-span-3 pl-32 pt-4 relative">
          <div className="text-5xl hover:bg-gray-800 rounded-full p-1 h-fit w-fit cursor-pointer transition-all ">
            <LiaTeamspeak />
          </div>
          <div className="mt-3 text-2xl pr-4">
            <ul>
              {sideBarMenuItems.map((item) => (
                <li className="flex justify-start items-center gap-4 hover:bg-gray-800 rounded-full px-4 py-2 w-fit cursor-pointer" key={item.title}>
                  <span>{item.icon}</span>
                  <span>{item.title}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 p-3 flex">
              <button className="py-2 px-4 bg-[#1d9bf0] font-semibold text-lg rounded-full mx-50 w-full">Post</button>
            </div>
          </div>
          {
            user && (
            <div className="absolute bottom-5 flex gap-2 items-center bg-slate-800 rounded-full px-3 py-2 w-fit cursor-pointer mr-4 ">
              {user && user?.profileImageUrl && <Image className="rounded-full  " src={user?.profileImageUrl} alt="user-image" height={50} width={50}/>}
              <div>
                <h3 className="text-xl">{user.firstName} {user.lastName}</h3>
              </div>
            </div>)
          }
          
        </div>
        
        <div className="col-span-5 border-l-[0.5px] border-r-[0.5px] h-screen overflow-scroll border-gray-700">
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
            posts && posts?.map((post) => post ? <FeedCard key={post?.id} data={post as Post} /> : null )
          }
        </div>
        <div className="col-span-3 p-5">
          {!user && 
            <div className=" p-5 bg-slate-700 rounded-lg ">
              <h1 className="my-2 text-2xl ">New to Echo ?</h1>
              <GoogleLogin
                onSuccess={credentialResponse => {
                  handleLoginWithGoogle(credentialResponse)
                  // console.log(credentialResponse);
                }}
                onError={() => {
                  console.log('Login Failed');
                }}
              />
            </div>}
        </div>
      </div>
    </div>
  )
}
