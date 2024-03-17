"use client"

import EditUser from '@/app/dashboard/user/edit-user';
import { baseUrl } from '@/constants';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { Trash2 } from 'lucide-react';
import moment from 'moment';
import React from 'react'
import { useToast } from './ui/use-toast';
import Spinner from './spinner';
import TableList from './table-list';
import Link from 'next/link';
import { CardTitle } from './ui/card';

function UserList() {
    const { toast } = useToast();
    let { isPending, isError, data, error, refetch } = useQuery<GetUsersRes, AxiosError<ApiCustomError>>({
      queryKey: ["users"],
      queryFn: async () => {
        const res: AxiosResponse<GetUsersRes> = await axios.get(
          `${baseUrl}/user/all?page=1&limit=6`,
          {
            withCredentials: true,
          }
        );
        return res.data;
      },
    });
  
  
    if(data) {
      // formatting the date
      data.users = data.users.map(item => {
        if(item.createdAt) {
          item.formattedCreatedAt = moment(item.createdAt).format("DD-MM-YYYY")
        }
  
        if(item.updatedAt) {
          item.formattedUpdatedAt = moment(item.updatedAt).format("DD-MM-YYYY")
        }
  
        return item
      })
    }
  
      // handle delete user
  
      const { mutate: handleDelete } = useMutation({
        mutationFn: async (data: User) => {
          const res = await axios.delete(`${baseUrl}/user/${data._id}`, {
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
    
      const handleUserDelete = (data: User) => {
        handleDelete(data);
      };
  
    // table header
  
    const userTableHeader = [
      {
        column: "Name",
        dataIndex: "name"
      },
      {
        column: "Email",
        dataIndex: "email"
      },
      {
        column: "Role",
        dataIndex: "role"
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
                <EditUser data={data} refetch={refetch} />
              </div>
              <div
                className="cursor-pointer"
                onClick={() => handleUserDelete(data)}
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
        <CardTitle className='mb-6 mt-9 mx-3'>Users</CardTitle>
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

{ data && data.users.length > 0 && (
          <div>
            <TableList data={data.users} header={userTableHeader} />
          </div>
          )}
          <div className="flex justify-end text-blue-500">
          <Link href="./dashboard/user">view more</Link>
          </div>
    </div>
  )
}

export default UserList