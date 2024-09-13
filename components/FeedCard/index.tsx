import Image from 'next/image'
import React from 'react'
import { AiOutlineHeart } from 'react-icons/ai'
import { BiMessageRounded, BiUpload } from 'react-icons/bi'
import { FaRetweet } from 'react-icons/fa'
import { Post } from '@/gql/graphql'
import Link from 'next/link'

interface FeedCardProps  {
  data: Post 
}

const FeedCard: React.FC<FeedCardProps> = (props) => {
  const {data} = props;
  return (
    <div className='p-5 border-t-[0.5px] border-gray-700 hover:bg-gray-900 transition-all cursor-pointer '>
      <div className='grid grid-cols-12 gap-2'>
        <div className='col-span-1 gap-3'>
          {data?.author?.profileImageUrl && <Image alt="user-image" src={data?.author?.profileImageUrl} height={50} width={50} className='rounded-full' />} 
        </div>
        <div className='col-span-11'>
          <h3 className='text-bold cursor-pointer '>
            <Link href={`/${data?.author?.id}`}>{data?.author?.firstName} {data?.author?.lastName}</Link>
          </h3>
          <p>
          {data.content}
          </p>
          <div className='flex flex-row justify-between mt-5 text-xl items-center w-[90%] p-2'>
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
