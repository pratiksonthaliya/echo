import { useCurrentUser, useGetLikedPostByUser } from "@/hooks/user";
import { Post } from "@/gql/graphql";
import FeedCard from "@/components/FeedCard";
import EchoLayout from "@/components/Layout/EchoLayout";
import Link from "next/link";
import { BsArrowLeftShort } from "react-icons/bs";

const Bookmarks: React.FC = () => {
    const { user } = useCurrentUser();
    const userId = user?.id;

    const { data: likedPosts } = useGetLikedPostByUser(userId as string);
    if(!likedPosts?.getLikedPostsByUser || likedPosts?.getLikedPostsByUser.length === 0){
      return <>
        <EchoLayout>
            <div>
            <nav className="flex items-center gap-3 py-3 px-3">
                <Link href='/'>
                <BsArrowLeftShort className="text-4xl md:text-5xl hover:bg-gray-800 rounded-full p-1 h-fit w-fit cursor-pointer transition-all mb-4"/>
                </Link>
                <div>
                    <h1 className="text-xl font-bold">Like posts to see here.</h1>
                    <h1 className="text-md font-bold text-slate-500">{likedPosts?.getLikedPostsByUser.length} Posts</h1>
                </div>
            </nav>
            </div>
        </EchoLayout>
      </>
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
                        <h1 className="text-xl font-bold">My Liked Posts</h1>
                        <h1 className="text-md font-bold text-slate-500">{likedPosts?.getLikedPostsByUser.length} Posts</h1>
                    </div>
                </nav>
                </div>
                <div>
                {likedPosts?.getLikedPostsByUser.map((post) => (
                    <FeedCard key={post.id} data={post as Post} />  // Reuse FeedCard component
                ))}
                </div>                    
            </EchoLayout>
        </div>
    );
   
  
  };
  
export default Bookmarks;