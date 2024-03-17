"use client"

import { Trash2 } from 'lucide-react'
import Image from 'next/image';
import React, { useState } from 'react'

interface DeletePhotoProps {
    photo: Photos;
    photos: Photos[];
    setPhotos: React.Dispatch<React.SetStateAction<Photos[]>>;
}

function DeletePhoto({ photo, setPhotos, photos }: DeletePhotoProps) {

    const handleSelectPhoto = () => {
      

        setPhotos(prev => {
            let isRemoved = false;
            let updatedArr = prev.filter(item => {
                if(item.secure_url === photo.secure_url){
                    isRemoved = true;
                }
                return item.secure_url !== photo.secure_url
            })

            if(isRemoved) return updatedArr;
            prev.push(photo)
            return [...prev]
        })
    }


  return (
    <div className='w-[250px] relative' key={photo.secure_url}>
    <Trash2 color="red" className="absolute top-2 right-2 cursor-pointer" onClick={handleSelectPhoto} />
<Image width={250} height={300} className={`w-full h-auto ${photos.some(item => item.secure_url === photo.secure_url) ? "border border-red-500" : ""}`} src={photo.secure_url} alt={photo.secure_url} />
</div>
  )
}

export default DeletePhoto