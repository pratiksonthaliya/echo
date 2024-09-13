import { useCurrentUser } from '@/hooks/user';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import React, { useCallback, useMemo } from 'react'
import { BiBell, BiBookmark, BiEnvelope, BiHash, BiSolidHome, BiUser } from "react-icons/bi";
import { LiaTeamspeak } from 'react-icons/lia';
import { SlOptions } from 'react-icons/sl';
import Image from "next/image";
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { graphqlClient } from '@/clients/api';
import { verifyUserGoogleTokenQuery } from '@/graphql/query/user';
import Link from 'next/link';

interface EchoLayoutProps {
    children: React.ReactNode
}

interface EchoSideButton {
    title: string,
    icon: React.ReactNode
    link: string
}
 

const EchoLayout: React.FC<EchoLayoutProps> = (props) => {

  const { user } = useCurrentUser();  
  const queryClient = useQueryClient();

  const sideBarMenuItems:EchoSideButton[] = useMemo(() => [
    {
      title: 'Home',
      icon:  <BiSolidHome />,
      link: '/'
    },
    {
      title: 'Explore',
      icon:  <BiHash />,
      link: '/'  
    },
    {
      title: 'Notifications',
      icon:  <BiBell />,
      link: '/'
    },
    {
      title: 'Messages',
      icon:  <BiEnvelope />,
      link: '/'
    },
    {
      title: 'Bookmarks',
      icon:  <BiBookmark />,
      link: '/'
    },
    {
      title: 'Profile',
      icon:  <BiUser />,
      link: `/${user?.id}`
    },
    {
      title: 'More Options',
      icon: <SlOptions />,
      link: '/'
    }
 ], [user?.id])

  const handleLoginWithGoogle = useCallback( async (credentialResponse: CredentialResponse) => {
    const googleToken = credentialResponse.credential;

    if(!googleToken) return toast.error(`Google Token Not Found`);

    try {
      const { verifyGoogleToken }  = await graphqlClient.request(verifyUserGoogleTokenQuery , {token: googleToken});

      toast.success(`Verified Successful`) 
      console.log(verifyGoogleToken);
      
      if(verifyGoogleToken) window.localStorage.setItem('__echo_token', verifyGoogleToken);

      await queryClient.invalidateQueries({ queryKey: ['current-user'], refetchType: 'all' });

    } catch (error) {
      return toast.error(`Google Token Not Found`);
    }

  }, [queryClient]);

  return (
    // <div>
    //   <div className="grid grid-cols-12 h-screen w-screen sm:px-56">
    //     <div className="col-span-2 sm:col-span-3 flex sm:justify-end pr-4 pt-4 relative">
    //         <div>
    //             <div className="text-5xl hover:bg-gray-800 rounded-full p-1 h-fit w-fit cursor-pointer transition-all ">
    //                 <LiaTeamspeak />
    //             </div>
    //             <div className="mt-3 text-2xl pr-4">
    //                 <ul>
    //                 {sideBarMenuItems.map((item) => (
    //                     <li className="flex justify-start items-center gap-4 hover:bg-gray-800 rounded-full px-4 py-2 w-fit cursor-pointer" key={item.title}>
    //                     <span>{item.icon}</span>
    //                     <span className='hidden sm:inline'>{item.title}</span>
    //                     </li>
    //                 ))}
    //                 </ul>
    //                 <div className="mt-3 p-2 sm:p-3 flex ">
    //                     <button className="hidden sm:block py-2 px-4 bg-[#1d9bf0] font-semibold text-lg rounded-full mx-50 w-full">Post</button>
    //                     <button className="block sm:hidden py-2 px-4 bg-[#1d9bf0] font-semibold text-lg rounded-full mx-50 w-full"><LiaTeamspeak /></button>
    //                 </div>
    //             </div>
    //         </div>

    //       {
    //         user && (
    //         <div className="absolute bottom-5 flex gap-2 items-center bg-slate-800 rounded-full px-3 py-2 w-fit cursor-pointer mr-4 ">
    //           {user && user?.profileImageUrl && <Image className="rounded-full  " src={user?.profileImageUrl} alt="user-image" height={50} width={50}/>}
    //           <div className='hidden sm:block'>
    //             <h3 className=" text-xl">{user.firstName} {user.lastName}</h3>
    //           </div>
    //         </div>)
    //       }
          
    //     </div>
        
    //     <div className="col-span-10  sm:col-span-5 border-l-[0.5px] border-r-[0.5px] h-screen overflow-scroll border-gray-700">
    //       {props.children}
    //     </div>
        
    //     <div className="hidden sm:col-span-3 p-5">
    //       {!user && 
    //         <div className="p-5 bg-slate-700 rounded-lg ">
    //           <h1 className="my-2 text-2xl ">New to Echo ?</h1>
    //           <GoogleLogin
    //             onSuccess={credentialResponse => {
    //               handleLoginWithGoogle(credentialResponse)
    //               // console.log(credentialResponse);
    //             }}
    //             onError={() => {
    //               console.log('Login Failed');
    //             }}
    //           />
    //         </div>}
    //     </div>
    //   </div>
    // </div>

    

<div className="min-h-screen w-full">
  <div className="grid grid-cols-12 gap-4 px-2 sm:px-4 md:px-6 lg:px-8 xl:px-12">
    {/* Sidebar */}
    <div className='col-span-2 md:col-span-3 lg:col-span-2 xl:col-span-3 flex md:justify-end h-screen sticky'>
    <div className=" flex flex-col justify-between pt-4">
      <div>
        <div className="text-4xl md:text-5xl hover:bg-gray-800 rounded-full p-1 h-fit w-fit cursor-pointer transition-all mb-4">
          <LiaTeamspeak />
        </div>
        <nav className="p-1 sm:p-0 mt-3">
          <ul className="space-y-2">
            {sideBarMenuItems.map((item) => (
              <li key={item.title} >
                <Link className="flex items-center gap-4 hover:bg-gray-800 rounded-full px-2 py-2 md:px-4 cursor-pointer" href={item.link}>
                    <span className="text-xl md:text-2xl">{item.icon}</span>
                    <span className='hidden md:inline text-sm lg:text-base'>{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-3">
          <button className="w-full bg-[#1d9bf0] font-semibold rounded-full transition-all hover:bg-[#1a8cd8]">
            <span className="hidden md:inline py-2 px-4 text-base lg:text-lg">Post</span>
            <span className="md:hidden p-2 text-2xl flex justify-center items-center">
              <LiaTeamspeak />
            </span>
          </button>
        </div>
      </div>
      {user && (
        <div className="flex items-center gap-2 bg-slate-800 rounded-full px-2 py-2 md:px-3 cursor-pointer mb-4 max-w-full">
          {user.profileImageUrl && (
            <Image className="rounded-full flex-shrink-0" src={user.profileImageUrl} alt="user-image" height={40} width={40} />
          )}
          <div className='hidden md:block overflow-hidden'>
            <h3 className="text-sm lg:text-base truncate">{user.firstName} {user.lastName}</h3>
          </div>
        </div>
      )}
    </div>
    </div>

    {/* Main Content */}
    <main className="col-span-10 md:col-span-6 lg:col-span-7 xl:col-span-6 border-x border-gray-700 h-screen overflow-scroll">
      {props.children}
    </main>

    {/* Right Sidebar */}
    <div className="hidden md:block md:col-span-3 lg:col-span-3 xl:col-span-3 p-4">
      {!user && (
        <div className="p-4 bg-slate-700 rounded-lg">
          <h1 className="mb-4 text-xl lg:text-2xl">New to Echo?</h1>
          <GoogleLogin
            onSuccess={handleLoginWithGoogle}
            onError={() => console.log('Login Failed')}
          />
        </div>
      )}
    </div>
  </div>
</div>
  )
}

export default EchoLayout;

