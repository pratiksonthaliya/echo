import Image from 'next/image'
import React from 'react'
import { AiOutlineHeart } from 'react-icons/ai'
import { BiMessageRounded, BiUpload } from 'react-icons/bi'
import { FaRetweet } from 'react-icons/fa'
import { Maybe, Post } from '@/gql/graphql'
import Link from 'next/link'

interface FeedCardProps  {
  data: Post 
}

const FeedCard: React.FC<FeedCardProps> = (props) => {
  const {data} = props;
  const createdAt: Maybe<string> | undefined = data?.createdAt;
  const timestamp = createdAt && !isNaN(Number(createdAt)) ? Number(createdAt) : undefined;
  const formattedDate = timestamp
    ? Intl.DateTimeFormat('en-US', { 
        month: 'short', 
        day: 'numeric', 
        // year: 'numeric', 
        hour: 'numeric', 
        minute: 'numeric', 
        hour12: true 
    }).format(new Date(timestamp))
    : 'Invalid Date or Time';
  return (
    <div className='p-5 border-t-[0.5px] border-gray-700 hover:bg-gray-900 transition-all cursor-pointer '>
      <div className='grid grid-cols-12 gap-2'>
        <div className='col-span-1 gap-3'>
        <Link href={`/${data?.author?.id}`}>
          {data?.author?.profileImageUrl && <Image alt="user-image" src={data?.author?.profileImageUrl} height={50} width={50} className='rounded-full' />} 
        </Link>
        </div>
        <div className='col-span-11'>
          <div className='flex gap-2'>
            <h3 className='text-md font-semibold cursor-pointer'>
              <Link href={`/${data?.author?.id}`}>{data?.author?.firstName} {data?.author?.lastName}</Link>
            </h3>
            {
              formattedDate && <p className='text-slate-600 text-sm m-0.5'>{formattedDate}</p>
            }
          </div>
          <p>
          {data.content}
          </p>
          {data.imageURL && <Image src={data.imageURL} alt='Post-image' height={300} width={300}/>}
          <div className='flex flex-row justify-between mt-5 text-md items-center w-[90%] p-2'>
            <div><BiMessageRounded/></div>
            <div><FaRetweet/></div>
            <div><AiOutlineHeart/></div>
            <div><BiUpload/></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeedCard
