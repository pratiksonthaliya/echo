'use client'
import { useCurrentUser } from '@/hooks/user';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import React, { useCallback, useEffect, useState } from 'react'
import { BiBookmark, BiSolidHome, BiUser } from "react-icons/bi";
import { LiaTeamspeak } from 'react-icons/lia';
import Image from "next/image";
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { graphqlClient } from '@/clients/api';
import { verifyUserGoogleTokenQuery } from '@/graphql/query/user';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { AiOutlineHeart } from 'react-icons/ai';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX } from 'react-icons/hi';
import { FaSlackHash } from 'react-icons/fa';

interface EchoLayoutProps {
    children: React.ReactNode
}

const EchoLayout: React.FC<EchoLayoutProps> = (props) => {

  const [isClient, setIsClient] = useState(false); // Check if running on client
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);

  useEffect(() => {
    setIsClient(true); // This runs only on the client-side
  }, []);

  const router = useRouter();
  const { user } = useCurrentUser();  
  const queryClient = useQueryClient();

  const handleClickProfile = (e: { preventDefault: () => void; }) => {
    if (!user?.id) {
      e.preventDefault(); // Prevent the link from navigating
      toast.error("Please Login to access this page!");
    } else {
      router.push(`/${user.id}`);
    }
  };

  const handleClickBookmark = (e: { preventDefault: () => void; }) => {
    if (!user?.id) {
      e.preventDefault(); // Prevent the link from navigating
      toast.error("Please Login to access this page!");
    } else {
      router.push(`/bookmarks`);
    }
  };

  const handleClickLikedPosts = (e: { preventDefault: () => void; }) => {
    if (!user?.id) {
      e.preventDefault(); // Prevent the link from navigating
      toast.error("Please Login to access this page!");
    } else {
      router.push(`/likedPosts`);
    }
  };

  const handleLoginWithGoogle = useCallback( async (credentialResponse: CredentialResponse) => {
    const googleToken = credentialResponse.credential;

    if(!googleToken) return toast.error(`Google Token Not Found`);

    try {
      const { verifyGoogleToken }  = await graphqlClient.request(verifyUserGoogleTokenQuery , {token: googleToken});

      toast.success(`Verified Successful`) 
      // console.log(verifyGoogleToken);
      
      if(verifyGoogleToken){
        window.localStorage.setItem('__echo_token', verifyGoogleToken);
      } 

      await queryClient.invalidateQueries({ queryKey: ['current-user'], refetchType: 'all' });

    } catch (error) {
      return toast.error(`Google Token Not Found`);
    }

  }, [queryClient]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleRightSidebar = () => {
    setIsRightSidebarOpen(!isRightSidebarOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const RightSidebarContent = () => (
    <div className="space-y-4 ">
      {/* <div className="relative">
        <input
          type="text"
          placeholder="Search Echo"
          className="w-full bg-gray-800 text-white rounded-full py-3 px-5 pl-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div> */}

      {(!user || !user?.id) ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-6 bg-gray-800 rounded-xl overflow-hidden shadow-lg"
        >
          <h1 className="mb-4 text-xl font-bold">New to Echo?</h1>
          <p className="mb-4 text-sm text-gray-300">Sign up now to get your own personalized timeline!</p>
          <GoogleLogin
            onSuccess={handleLoginWithGoogle}
            onError={() => console.log('Login Failed')}
          />
        </motion.div>
      ) : (
        <div>
          {(user?.recommendedUsers?.length ?? 0) > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className='p-6 bg-gray-800 rounded-xl shadow-lg'
            >
              <h2 className='mb-4 text-xl font-bold'>Who to follow</h2>
              {user?.recommendedUsers && (
                user?.recommendedUsers.slice(0, 3).map((el) => (
                  <motion.div
                    key={el?.id}
                    whileHover={{ scale: 1.03 }}
                    className='flex items-center gap-4 py-4 border-b border-gray-700 last:border-b-0'
                  >
                    {el?.profileImageUrl && (
                      <Image className="rounded-full flex-shrink-0" src={el?.profileImageUrl} alt={`${el.firstName} ${el.lastName}`} height={48} width={48} />
                    )}
                    <div className='flex-grow overflow-hidden'>
                      <h3 className="font-bold truncate">{el?.firstName} {el?.lastName}</h3>
                      <p className="text-sm text-gray-400 truncate">@{el?.firstName?.toLowerCase()}{el?.lastName?.toLowerCase()}</p>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className='bg-white text-black px-4 py-1 rounded-full text-sm font-bold hover:bg-gray-200 transition-colors duration-200'
                      onClick={() => router.push(`/${el?.id}`)}
                    >
                      View
                    </motion.button>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}
        </div>
      )}

      {user?.recommendedUsers?.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-6 bg-gray-800 rounded-xl overflow-hidden shadow-lg"
        >
          <h1 className="mb-4 text-xl font-bold">Follow some users to get Recommended Users</h1>
        </motion.div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen w-screen bg-black text-white flex">
      <div className="grid grid-cols-12 gap-4 min-h-screen">

        {/* Mobile Menu Button and Right Sidebar Toggle*/}
        <div className="col-span-12 md:hidden flex justify-between items-center p-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={toggleMobileMenu}
            // className="text-3xl"
            className="text-3xl flex items-center gap-4 hover:bg-gray-800 rounded-full px-4 py-3 transition-colors duration-200"
          >
            <HiMenu />
          </motion.button>
          <div className='text-4xl'>
          <LiaTeamspeak className="py-1 px-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-full transition-all shadow-lg hover:shadow-xl"/>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={toggleRightSidebar}
            // className="text-3xl"
            className="text-3xl  flex items-center gap-4 hover:bg-gray-800 rounded-full px-4 py-3 transition-colors duration-200"
          >
            <FaSlackHash />
          </motion.button>
        </div>

        {/* SideBar PC */}
        <AnimatePresence>
          {(isClient && (isMobileMenuOpen || window.innerWidth >= 768)) && (
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              style={{ maxHeight: '100vh' }}
              className="col-span-12 md:col-span-3 fixed md:sticky top-0 left-0 h-screen bg-black z-50 md:z-auto flex md:justify-end overflow-hidden"
            >
              <div className="flex flex-col justify-between h-full p-4 overflow-hidden relative">
                <div>

                {/* Close button for mobile */} 
                  {window.innerWidth < 768 && (
                    <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={closeMobileMenu} // Close sidebar
                    // className="absolute top-4 right-4 text-2xl"
                    className="absolute text-2xl items-center hover:bg-gray-800 rounded-full px-4 py-2 cursor-pointer transition-colors duration-200 bg-red-600"
                  >
                    <HiX className=''/>
                  </motion.button>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-full transition-all shadow-lg hover:shadow-xl"
                  >
                    <span className="p-2 sm:py-2 sm:pl-3 sm:pr-4 items-center hidden md:flex ">
                      <LiaTeamspeak className="h-full w-full text-4xl sm:mr-2" />
                      <span className="hidden md:inline md:text-2xl">Echo</span>
                    </span>
                  </motion.button>
                  <nav className="mt-6 space-y-4">
                    <Link href="/" className="flex items-center gap-4 hover:bg-gray-800 rounded-full px-4 py-3 transition-colors duration-200">
                      <BiSolidHome className="text-2xl" />
                      <span className="hidden md:inline text-xl truncate">Home</span>
                    </Link>
                    <motion.div
                      whileTap={{ scale: 0.95 }}
                      onClick={handleClickProfile}
                      className="flex items-center gap-4 hover:bg-gray-800 rounded-full px-4 py-3 cursor-pointer transition-colors duration-200"
                    >
                      <BiUser className="text-2xl" />
                      <span className="hidden md:inline text-xl truncate">Profile</span>
                    </motion.div>
                    <motion.div
                      whileTap={{ scale: 0.95 }}
                      onClick={handleClickLikedPosts}
                      className="flex items-center gap-4 hover:bg-gray-800 rounded-full px-4 py-3 cursor-pointer transition-colors duration-200"
                    >
                      <AiOutlineHeart className="text-2xl" />
                      <span className="hidden md:inline text-xl truncate">Liked Posts</span>
                    </motion.div>
                    <motion.div
                      whileTap={{ scale: 0.95 }}
                      onClick={handleClickBookmark}
                      className="flex items-center gap-4 hover:bg-gray-800 rounded-full px-4 py-3 cursor-pointer transition-colors duration-200"
                    >
                      <BiBookmark className="text-2xl" />
                      <span className="hidden md:inline text-xl truncate">Bookmarks</span>
                    </motion.div>
                  </nav>
                </div>
                {user && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 bg-gray-800 rounded-full px-4 py-3 cursor-pointer"
                  >
                    {user.profileImageUrl && (
                      <Image className="rounded-full flex-shrink-0" src={user.profileImageUrl} alt="user-image" height={40} width={40} />
                    )}
                    <div className='hidden md:block overflow-hidden'>
                      <h3 className="text-sm lg:text-base truncate">{user.firstName} {user.lastName}</h3>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="col-span-12 md:col-span-6 border-x border-gray-800 min-h-screen overflow-y-auto flex-grow flex flex-col">
          <div className='w-screen md:w-fit min-h-screen'>
          <div className=' border-t border-slate-700'>
            {(isClient && (isMobileMenuOpen || window.innerWidth < 768)) && 
                (!user || !user?.id) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="p-6 bg-gray-800 rounded-xl overflow-hidden shadow-lg m-6"
                >
                  <h1 className="mb-4 text-xl font-bold">New to Echo?</h1>
                  <p className="mb-4 text-sm text-gray-300">Sign up now to get your own personalized timeline!</p>
                  <GoogleLogin
                    onSuccess={handleLoginWithGoogle}
                    onError={() => console.log('Login Failed')}
                  />
                </motion.div>
              )}
          </div>
          {props.children}
          </div>
        </main>

        {/* Right Sidebar for larger screens */}
        <div className="hidden md:block md:col-span-3 p-4">
          <div className="sticky top-0 space-y-4">
            <RightSidebarContent />
          </div>
        </div>

        {/* Right Sidebar for mobile/tablet */}
        <AnimatePresence>
          {isRightSidebarOpen && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="fixed top-0 right-0 h-screen w-80 bg-black z-50 p-4 overflow-y-auto"
            >
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={toggleRightSidebar}
                className="absolute top-4 right-4 text-2xl"
              >
                <HiX />
              </motion.button>
              <div className="mt-12">
                <RightSidebarContent />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default EchoLayout;

