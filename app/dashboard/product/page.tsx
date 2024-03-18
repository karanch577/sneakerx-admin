"use client"

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, FilePenLine, PlusCircle, Trash2 } from "lucide-react";
import Link from "next/link";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";
import { baseUrl } from "@/constants";
import TableList from "@/components/table-list";
import moment from "moment"
import Spinner from "@/components/spinner";
import { PaginationComponent } from "@/components/pagination";
import { useToast } from "@/components/ui/use-toast";


function Product() {
  const [page, setPage] = useState<number>(1);
  console.log(page)

  const { toast } = useToast();

  let { isPending, isError, data, error, refetch } = useQuery<GetProductsRes, AxiosError<ApiCustomError>>({
    queryKey: ["products", page],
    queryFn: async () => {
      const res: AxiosResponse<GetProductsRes> = await axios.get(
        `${baseUrl}/product/list?page=${page}&limit=10`,
        {
          withCredentials: true,
        }
      );
      return res.data;
    },
  });


  if(data) {
    // formatting the date
    data.products = data.products.map(item => {
      if(item.createdAt) {
        item.formattedCreatedAt = moment(item.createdAt).format("DD-MM-YYYY")
      }

      if(item.updatedAt) {
        item.formattedUpdatedAt = moment(item.updatedAt).format("DD-MM-YYYY")
      }

      return item
    })
  }

  // handle delete product

  const { mutate: handleDelete } = useMutation({
    mutationFn: async (data: Product) => {
      const res = await axios.delete(`${baseUrl}/product/${data._id}`, {
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

  const handleProductDelete = (data: Product) => {
    handleDelete(data);
  };

  // table header
  const productTableHeader = [
    {
      column: "Name",
      dataIndex: "name"
    },
    {
      column: "Price",
      dataIndex: "price"
    },
    {
      column: "Selling Price",
      dataIndex: "sellingPrice"
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
            <Link href={`./product/${data._id}`}>
            <Eye />
            </Link>
            <Link href={`./product/update/${data._id}`}>
              <FilePenLine />
            </Link>
            <div
              className="cursor-pointer"
              onClick={() => handleProductDelete(data)}
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
          <CardTitle className="mx-3">Product</CardTitle>
        </CardHeader>
        <CardContent>
          <Link href="/dashboard/product/add" className="flex items-center gap-1 justify-end">
            <p className="font-semibold">Add</p>
            <PlusCircle size={15} color="green" />
          </Link>

          {isPending && (
            <div className="flex justify-center items-center h-[400px]">
              <Spinner />
            </div>
          )}

          {isError && error && (
            <div className="text-center my-24">
              <p>{error.response?.data.message}</p>
            </div>
          )}

          { data && data.products.length > 0 && (
          <div>
            <TableList data={data.products} header={productTableHeader} />
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

export default Product;
