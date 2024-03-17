"use client"

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusCircle, Trash2 } from "lucide-react";
import Link from "next/link";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";
import { baseUrl } from "@/constants";
import TableList from "@/components/table-list";
import moment from "moment"
import Spinner from "@/components/spinner";
import { useToast } from "@/components/ui/use-toast";
import EditCategory from "./edit-category";
import { PaginationComponent } from "@/components/pagination";



function Category() {
  const [page, setPage] = useState<number>(1)

  const { toast } = useToast();

  let { isPending, isError, error, data, refetch } = useQuery<GetCategoriesRes, AxiosError<ApiCustomError>>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res: AxiosResponse<GetCategoriesRes> = await axios.get(
        `${baseUrl}/category/all?page=${page}&limit=10`,
        {
          withCredentials: true,
        }
      );
      return res.data;
    },
  });


  if(data) {
    // formatting the date
    data.collections = data.collections.map(item => {
      if(item.createdAt) {
        item.formattedCreatedAt = moment(item.createdAt).format("DD-MM-YYYY")
      }

      if(item.updatedAt) {
        item.formattedUpdatedAt = moment(item.updatedAt).format("DD-MM-YYYY")
      }

      return item
    })
  }

   // handle delete category

   const { mutate: handleDelete } = useMutation({
    mutationFn: async (data: Category) => {
      const res = await axios.delete(`${baseUrl}/category/${data._id}`, {
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


  const handleCategoryDelete = (data: Category) => {
    handleDelete(data);
  };

  // table header

  const categoryTableHeader = [
    {
      column: "Name",
      dataIndex: "name"
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
            <div className="cursor-pointer">
              <EditCategory data={data} refetch={refetch} />
            </div>
            <div
              className="cursor-pointer"
              onClick={() => handleCategoryDelete(data)}
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
          <CardTitle>Category</CardTitle>
        </CardHeader>
        <CardContent>
          <Link href="/dashboard/category/add" className="flex items-center gap-1 justify-end">
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

          { data && data.collections.length > 0 && (
          <div>
            <TableList data={data.collections} header={categoryTableHeader} />
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

export default Category;
