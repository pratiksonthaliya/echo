import { useCallback, useState } from "react";
import { useCurrentUser } from "@/hooks/user";
import EchoLayout from "@/components/Layout/EchoLayout";
import { BiImageAlt } from "react-icons/bi";
import FeedCard from "@/components/FeedCard";
import Image from "next/image";
import { GetServerSideProps } from "next";
import { graphqlClient } from "@/clients/api";
import { getAllPostsQuery, getSignedURLForPostQuery } from "@/graphql/query/post";
import { useCreatePost, useGetAllPosts } from "@/hooks/post";
import axios from "axios";
import toast from "react-hot-toast";
import { Post } from "@/gql/graphql";

interface HomeProps {
  posts?: Post[]
}
 
export default function Home(props: HomeProps) {

  const { user } = useCurrentUser();  
  const { mutateAsync } = useCreatePost();
  const {posts = props.posts as Post[]} = useGetAllPosts();

  const [content, setContent] = useState("");
  const [imageURL, setImageURL] = useState("");

  const handleCreatePost = useCallback(async () => {
    if(!user || !user?.id){
      toast.error('Please Login to Post!');
      return;
    }

    if(!content && !imageURL){
      toast.error('Please Write something or Add a photo to Post!');
      return;
    }

    await mutateAsync({
      content,
      imageURL
    }) 
    setContent('');
    setImageURL('');
  }, [content, imageURL, mutateAsync, user]);

  const handleInputChnageFile = useCallback((input: HTMLInputElement) => {
    return async (event: Event) => {
      event.preventDefault();
      const file: File | null | undefined = input.files?.item(0);
      if(!file) return;

      const { getSignedURLForPost } = await graphqlClient.request(getSignedURLForPostQuery, {
        imageName: file.name,
        imageType: file.type
      })

      if(getSignedURLForPost){
        toast.loading('Uploading Image...', {id: '2'});
        await axios.put(getSignedURLForPost, file, {
          headers: {
            'Content-Type': file.type
          }
        });
        toast.success('Upload Success...', {id: '2'});

        const url = new URL(getSignedURLForPost);
        const myFilePath = `${url.origin}${url.pathname}`;
        setImageURL(myFilePath);
      }
    }
  }, [])

  const handleSelectImage = useCallback(() => {
    if(!user || !user?.id){
      toast.error('Please Login to Add a Image!');
      return;
    }
    const input = document.createElement('input');
    input.setAttribute('type', 'file'); 
    input.setAttribute('accept', 'image/*');

    const handlerFn = handleInputChnageFile(input);
    input.addEventListener('change', handlerFn);

    input.click();
  }, [handleInputChnageFile, user]);

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
              <textarea id="Post-data" value={content} onChange={e => setContent(e.target.value)} className="w-full bg-transparent text-xl px-3 border-b border-slate-700" rows={3} placeholder="What's happening?" name=""></textarea>
              {imageURL && <Image src={imageURL} alt="post-image" width={200} height={200}/>}
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
    </EchoLayout>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  try {
    const allPosts = await graphqlClient.request(getAllPostsQuery);
    if (!allPosts || !allPosts?.getAllPosts) {
      return {
        props: { posts: [] },
      };
    }

    return {
      props: { posts: allPosts.getAllPosts as Post[]},
    };
  } catch (error) {
    // console.error('Error fetching posts:', error);

    return {
      props: { posts: [] }, // Or you could return { notFound: true }
    };
  }
}