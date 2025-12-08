"use client"

import Spinner from '@/components/icons/Spinner'

const LoadingPageOverlay = () => {
  return (
    <div className='fixed top-0 left-0 h-[calc(var(--vh,1vh)*100)] w-screen flex justify-center items-center'>
      <Spinner />
    </div>
  )
}

export default LoadingPageOverlay