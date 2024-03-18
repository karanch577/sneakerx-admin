"use client"

import { baseUrl } from "@/constants";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";
import { Eye, FilePenLine, Trash2 } from "lucide-react";
import React from "react";
import { useToast } from "./ui/use-toast";
import Spinner from "./spinner";
import TableList from "./table-list";
import moment from "moment";
import Link from "next/link";
import { CardTitle } from "./ui/card";

function ProductList() {
    const { toast } = useToast();

  let { isPending, isError, data, error, refetch } = useQuery<
    GetProductsRes,
    AxiosError<ApiCustomError>
  >({
    queryKey: ["products"],
    queryFn: async () => {
      const res: AxiosResponse<GetProductsRes> = await axios.get(
        `${baseUrl}/product/list?page=1&limit=6`,
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
            <Link href={`./dashboard/product/update/${data._id}`}>
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
  <div>
    <CardTitle className="mx-3 mb-6">Products</CardTitle>
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
          </div>
          )}
          <div className="flex justify-end text-blue-500">
          <Link href="./dashboard/product">view more</Link>
          </div>
</div>
)
}

export default ProductList;
