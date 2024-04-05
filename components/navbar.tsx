"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserRound } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { baseUrl } from "@/constants";
import useUserStore from "@/store/useUserStore";
import Link from "next/link";
import { useRouter } from "next/navigation";


function Navbar() {
    const user = useUserStore(state => state.user)
    const router = useRouter()
    const removeUser = useUserStore(state => state.removeUser)
    const { mutate:handleLogout, isSuccess } = useMutation({
        mutationFn: async () => {
            const res = await axios.get(`${baseUrl}/user/signout`, {
                withCredentials: true
            })
            return res.data
        }
    })

    if(isSuccess) {
      localStorage.removeItem("isLoggedIn")
      removeUser()
    } 

  return (
    <div className="flex justify-between mx-16 my-3">
      <Link href="/dashboard" className="logo">SneakerXAdmin</Link>
      <div className="right">
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none"><UserRound /></DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Hi, {user?.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={"./dashboard/product"}>
              Product
            </Link></DropdownMenuItem>
            <DropdownMenuItem>
            <Link href={"./dashboard/order"}>
              Order
            </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
            <Link href={"./dashboard/user"}>
              User
            </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleLogout()}>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default Navbar;
