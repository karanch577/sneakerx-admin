"use client";

import Navbar from "@/components/navbar";
import Redirect from "@/components/redirect";
import Sidebar from "@/components/sidebar";
import useUserStore from "@/store/useUserStore";
import { ReactNode } from "react";

export default function DashboardLayout({
    children
}: Readonly<{
    children: ReactNode
}>) {
    const user = useUserStore(state => state.user)

    if(!user) {
    return <Redirect />
    }

    return (
        <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex flex-1">
            <Sidebar />
            <div className="w-full">
                {children}
            </div>
        </div>
        </div>
    )
}