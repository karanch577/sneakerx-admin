"use client"

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";
import { baseUrl } from "@/constants";
import TableList from "@/components/table-list";
import moment from "moment"
import Spinner from "@/components/spinner";
import EditOrder from "./edit-order";
import { Eye, Trash2 } from "lucide-react";
import Link from "next/link";
import { PaginationComponent } from "@/components/pagination";
import { useToast } from "@/components/ui/use-toast";


function Order() {
  const [page, setPage] = useState<number>(1)
  const { toast } = useToast();

  let { isPending, isError, error, data, refetch } = useQuery<GetOrdersRes, AxiosError<ApiCustomError>>({
    queryKey: ["orders", page],
    queryFn: async () => {
      const res: AxiosResponse<GetOrdersRes> = await axios.get(
        `${baseUrl}/order/all?page=${page}&limit=10`,
        {
          withCredentials: true,
        }
      );
      return res.data;
    }
  });

  if(error) {
    console.log(error.response?.data.message)
  }


  if(data) {
    // formatting the date
    data.orders = data.orders.map(item => {
      if(item.createdAt) {
        item.formattedCreatedAt = moment(item.createdAt).format("DD-MM-YYYY")
      }

      if(item.updatedAt) {
        item.formattedUpdatedAt = moment(item.updatedAt).format("DD-MM-YYYY")
      }

      if(item.user) {
        item.orderBy = item.user.name
      }

      if(item.products) {
        item.noOfProducts = item.products.length
      }

      return item
    })
  }

   // handle delete user

   const { mutate: handleDelete } = useMutation({
    mutationFn: async (data: Order) => {
      const res = await axios.delete(`${baseUrl}/order/${data._id}`, {
        withCredentials: true,
      });
      return res.data;
    },
    onError: (error: AxiosError<ApiCustomError>) => {
      if (error.response) {
        return toast({
          variant: "destructive",
          title: error.response.data.message,
        });
      }
    },
    onSuccess: (data: DeleteRes) => {
      if (data.success) {
        // refetching the latest data
        refetch();
        return toast({
          title: data.message,
          variant: "dark",
        });
      }
    },
  });


  const handleProductDelete = (data: Order) => {
    handleDelete(data);
  };


  const orderTableHeader = [
    {
      column: "Order By",
      dataIndex: "orderBy"
    },
    {
      column: "No of Products",
      dataIndex: "noOfProducts"
    },
    {
      column: "Order Status",
      dataIndex: "status"
    },
    {
      column: "Amount",
      dataIndex: "amount"
    },
    {
      column: "Transaction Status",
      dataIndex: "transactionStatus"
    },
    {
      column: "Transaction Id",
      dataIndex: "transactionId"
    },
    {
      column: "Created At",
      dataIndex: "formattedCreatedAt"
    },
    {
      column: "Updated At",
      dataIndex: "formattedUpdatedAt"
    },
    {
      column: "Actions",
      render: (data: any) => {
        return (
          <div className="flex gap-3">
            <Link href={`./order/${data._id}`}>
            <Eye />
            </Link>
            <div className="cursor-pointer">
              <EditOrder data={data} refetch={refetch} />
            </div>
            <div
              className="cursor-pointer"
              onClick={() => handleProductDelete}
            >
              <Trash2 />
            </div>
          </div>
        );
      },
    },
  ]


  return (
    <div className="mr-16 mt-12">
      <Card>
        <CardHeader>
          <CardTitle className="mx-3">Order</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end text-sm">
            <p className="flex items-center gap-1">* click <Eye size={18} /> for more details</p>
          </div>

          {isPending && (
            <div className="flex justify-center items-center h-[400px]">
              <Spinner />
            </div>
          )}

          {isError && error && (
            <div className="flex items-center my-24 justify-center">
              <p>{error.response?.data.message}</p>
            </div>
          )}

          { data && data.orders.length > 0 && (
          <div>
            <TableList data={data.orders} header={orderTableHeader} />
            <div className="mt-5">
                <PaginationComponent
                  currentPage={data.currentPage}
                  totalPage={data.totalPage}
                  setPage={setPage}
                />
              </div>
          </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default Order;
