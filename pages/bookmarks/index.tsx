import { useUserBookmarks } from "@/hooks/bookmark";
import { useCurrentUser } from "@/hooks/user";
import { Post } from "@/gql/graphql";
import FeedCard from "@/components/FeedCard";
import EchoLayout from "@/components/Layout/EchoLayout";
import Link from "next/link";
import { BsArrowLeftShort } from "react-icons/bs";

const Bookmarks: React.FC = () => {
    const { user } = useCurrentUser(); // Custom hook to get the current user
    const userId = user?.id;

    const { data: bookmarkData } = useUserBookmarks(userId as string);
    if(!bookmarkData?.getUserBookmarks || bookmarkData?.getUserBookmarks.length === 0){
      return <>
        <EchoLayout>
            <nav className="flex items-center gap-3 py-3 px-3">
                <Link href='/'>
                <BsArrowLeftShort className="text-4xl md:text-5xl hover:bg-gray-800 rounded-full p-1 h-fit w-fit cursor-pointer transition-all mb-4"/>
                </Link>
                <div>
                    <h1 className="text-xl font-bold">Add bookmarks to see here.</h1>
                    {
                        bookmarkData?.getUserBookmarks.length && <h1 className="text-md font-bold text-slate-500">{bookmarkData?.getUserBookmarks.length} Bookmarks</h1>
                    }
                </div>
            </nav>
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
                        <h1 className="text-xl font-bold">My Bookmarks</h1>
                        <h1 className="text-md font-bold text-slate-500">{bookmarkData?.getUserBookmarks.length} Bookmarks</h1>
                    </div>
                </nav>
                </div>
                <div>
                {bookmarkData?.getUserBookmarks.map((bookmark) => (
                    <FeedCard key={bookmark.id} data={bookmark?.post as Post} />  // Reuse FeedCard component
                ))}
                </div>                    
            </EchoLayout>
        </div>
    );
   
  
  };
  
export default Bookmarks;