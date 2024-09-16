import { useCurrentUser } from '@/hooks/user';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import React, { useCallback } from 'react'
import { BiSolidHome, BiUser } from "react-icons/bi";
import { LiaTeamspeak } from 'react-icons/lia';
import Image from "next/image";
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { graphqlClient } from '@/clients/api';
import { verifyUserGoogleTokenQuery } from '@/graphql/query/user';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface EchoLayoutProps {
    children: React.ReactNode
}

// interface EchoSideButton {
//     title: string,
//     icon: React.ReactNode
//     link: string
// }
 

const EchoLayout: React.FC<EchoLayoutProps> = (props) => {

  const router = useRouter();
  const { user } = useCurrentUser();  
  const queryClient = useQueryClient();

//   const sideBarMenuItems:EchoSideButton[] = useMemo(() => [
//     {
//       title: 'Home',
//       icon:  <BiSolidHome />,
//       link: '/'
//     },
//     {
//       title: 'Explore',
//       icon:  <BiHash />,
//       link: '/'  
//     },
//     {
//       title: 'Notifications',
//       icon:  <BiBell />,
//       link: '/'
//     },
//     {
//       title: 'Messages',
//       icon:  <BiEnvelope />,
//       link: '/'
//     },
//     {
//       title: 'Bookmarks',
//       icon:  <BiBookmark />,
//       link: '/'
//     },
//     {
//       title: 'Profile',
//       icon:  <BiUser />,
//       link: (user?.id) ? `/${user?.id}` : '/'
//     },
//     {
//       title: 'More Options',
//       icon: <SlOptions />,
//       link: '/'
//     }
//  ], [user?.id])

  const handleClick = (e: { preventDefault: () => void; }) => {
    if (!user?.id) {
      e.preventDefault(); // Prevent the link from navigating
      toast.error("Please Login to access this page!");
    } else {
      router.push(`/${user.id}`);
    }
  };

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
    <div className="min-h-screen w-full">
      <div className="grid grid-cols-12 gap-4 px-2 sm:px-4 md:px-6 lg:px-8 xl:px-12">
        {/* Sidebar */}
        <div className='col-span-2 md:col-span-3 lg:col-span-2 xl:col-span-3 flex md:justify-end h-screen sticky '>
        <div className=" flex flex-col justify-between pt-4">
          <div>
          <button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-full transition-all shadow-lg hover:shadow-xl">
            <span className="p-2 sm:py-2 sm:pl-3 sm:pr-4 flex items-center">
              <LiaTeamspeak className="h-full w-full text-4xl sm:mr-2" />
              <span className="hidden md:inline md:text-2xl">Echo</span>
            </span>
          </button>
            <nav className="p-1 sm:p-0 mt-3">
              {/* <ul className="space-y-2">
                {sideBarMenuItems.map((item) => (
                  <li key={item.title} >
                    <Link className="flex items-center gap-4 hover:bg-gray-800 rounded-full px-2 py-2 md:px-4 cursor-pointer" href={item.link}>
                      <span className="text-xl md:text-2xl">{item.icon}</span>
                      <span className='hidden md:inline text-sm lg:text-base'>{item.title}</span>
                    </Link>
                  </li>
                ))}
              </ul> */}
              <Link className="flex items-center gap-4 hover:bg-gray-800 rounded-full px-2 py-2 md:px-4 cursor-pointer" href='/'>
                <span className="text-2xl md:text-3xl"><BiSolidHome /></span>
                <span className='hidden md:inline md:text-xl'>Home</span>
              </Link>
              <div className="flex items-center gap-4 hover:bg-gray-800 rounded-full px-2 py-2 md:px-4 cursor-pointer" onClick={handleClick}>
                <span className="text-2xl md:text-3xl"><BiUser /></span>
                <span className='hidden md:inline md:text-xl'>Profile</span>
              </div>
            </nav>
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
        <div className="hidden md:block md:col-span-3 p-4">
          {!user ? (
            <div className="p-4 bg-slate-800 rounded-lg overflow-hidden">
              <h1 className="mb-4 text-xl lg:text-2xl">New to Echo?</h1>
              <GoogleLogin
                onSuccess={handleLoginWithGoogle}
                onError={() => console.log('Login Failed')}
              />
            </div>
          ): (
            <div>
              {(user?.recommendedUsers?.length ?? 0)> 0 && (
                <div className='p-4 bg-slate-800 rounded-lg'>
                  <h1 className=' mb-4 text-2xl'>Users you may know!</h1>
                    {user?.recommendedUsers && (
                    user?.recommendedUsers.map((el) => (
                      <button onClick={() => router.push(`/${el?.id}`)} key={el?.id} className="flex items-center gap-2 bg-slate-900 rounded-full px-2 py-2 md:px-3 cursor-pointer mb-4 max-w-full">
                        {el?.profileImageUrl && (
                          <Image className="rounded-full flex-shrink-0" src={el?.profileImageUrl} alt="user-image" height={35} width={35} />
                        )}
                        <div className='hidden md:block overflow-hidden'>
                          <h3 className="text-sm lg:text-base truncate">{el?.firstName} {el?.lastName}</h3>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
          </div>  
        )}
        </div>
      </div>
    </div>
  )
}

export default EchoLayout;

