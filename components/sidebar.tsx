"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="min-w-[220px]">
      <ul className="w-full flex flex-col gap-4 mt-12">
        <li className={`text-center ${pathname === "/dashboard" ? "opacity-1" : "opacity-45"}`}>
          <Link href="/dashboard">Dashboard</Link>
        </li>
        <li className={`text-center ${pathname.includes("/dashboard/product") ? "opacity-1" : "opacity-45"}`}>
          <Link href="/dashboard/product">Product</Link>
        </li>
        <li className={`text-center ${pathname.includes("/dashboard/order") ? "opacity-1" : "opacity-45"}`}>
          <Link href="/dashboard/order">Order</Link>
        </li>
        <li className={`text-center ${pathname.includes("/dashboard/user") ? "opacity-1" : "opacity-45"}`}>
          <Link href="/dashboard/user">User</Link>
        </li>
        <li className={`text-center ${pathname.includes("/dashboard/category") ? "opacity-1" : "opacity-45"}`}>
          <Link href="/dashboard/category">Category</Link>
        </li>
        <li className={`text-center ${pathname.includes("/dashboard/coupon") ? "opacity-1" : "opacity-45"}`}>
          <Link href="/dashboard/coupon">Coupon</Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
