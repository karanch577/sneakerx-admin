import React from 'react'
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ProductList from '@/components/product-list';
import UserList from '@/components/user-list';
import Sales from '@/components/sales';


function DashboardPage() {

  return (
    <div className="mr-16 mt-12">
      <Card>
        <CardHeader>
        </CardHeader>
        <CardContent>
          <Sales />
          <ProductList />
          <UserList />
        </CardContent>
      </Card>
    </div>
  )
}

export default DashboardPage