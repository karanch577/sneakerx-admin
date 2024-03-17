"use client";

import { baseUrl } from '@/constants';
import useUserStore from '@/store/useUserStore';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React from 'react'


function Redirect() {
    const router = useRouter()
    const user = useUserStore(state => state.user)
    const addUser = useUserStore((state) => state.addUser)

    let isLoggedIn: boolean = false;
    if (typeof window !== 'undefined') {
      let value = localStorage.getItem("isLoggedIn")
      if(value !== null) {
        isLoggedIn = JSON.parse(value)
      }
    }

    const { data, isError } = useQuery({
      queryKey: ["user"],
      queryFn: async () => {
        const res = await axios.get(`${baseUrl}/user/getprofile`, {
          withCredentials: true })
        return res.data;
      },
      retry: 0,
      enabled: isLoggedIn && !user
    })

    if(data) {
      addUser(data.user)
      router.refresh()
    }

      if(isError) {
        localStorage.removeItem("isLoggedIn")
        router.push("/")
      }

    console.log("redirect call")

  return (
    <>
    </>
  )
}

export default Redirect