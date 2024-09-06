import Image from 'next/image'
import React from 'react'
import { AiOutlineHeart } from 'react-icons/ai'
import { BiMessageRounded, BiUpload } from 'react-icons/bi'
import { FaRetweet } from 'react-icons/fa'

const FeedCard: React.FC = () => {
  return (
    <div className='grid grid-cols-12 p-5 border-t-[0.5px] border-gray-700 hover:bg-gray-900 transition-all cursor-pointer gap-2'>
      <div className='col-span-1 gap-3'>
        <Image alt="user-image" src="https://cdn.vectorstock.com/i/1000v/51/87/student-avatar-user-profile-icon-vector-47025187.jpg" height={50} width={50} className='rounded-full' />
      </div>
      <div className='col-span-11'>
        <h5 >Pratik Sonthaliya</h5>
        <p>
        Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.
        </p>
        <div className='flex flex-row justify-between mt-5 text-xl items-center w-[90%] p-2'>
           <div><BiMessageRounded/></div>
           <div><FaRetweet/></div>
           <div><AiOutlineHeart/></div>
           <div><BiUpload/></div>
        </div>
      </div>
    </div>
  )
}

export default FeedCard
