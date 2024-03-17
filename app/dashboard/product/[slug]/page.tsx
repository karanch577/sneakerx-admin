"use client"

import ItemDetail from '@/components/item-detail';
import Spinner from '@/components/spinner';
import { baseUrl } from '@/constants';
import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import moment from 'moment';
import Image from 'next/image';

function ProductDetail({ params }: { params: { slug: string } }) {
    const { isPending, isError, data, error } = useQuery<
    GetProductDetail,
    AxiosError<ApiCustomError>
  >({
    queryKey: ["product", params.slug],
    queryFn: async () => {
      const res = await axios.get(`${baseUrl}/product/id/${params.slug}`, {
        withCredentials: true,
      });
      return res.data;
    },
  });
  return (
    <div className="mr-16 mt-12">
      <Card>
        <CardHeader>
          <CardTitle>Product Detail</CardTitle>
        </CardHeader>
        <CardContent>
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

          {!isError && !isPending && data && (
            <div>
              <div className="flex">
                <ItemDetail
                  className="w-1/3"
                  title="Product Id"
                  value={data.product._id}
                />
                <ItemDetail
                  title="Name"
                  value={data.product.name}
                />
              </div>

              <div className="flex my-5">
                <ItemDetail
                  className="w-1/3"
                  title="Category"
                  value={data.product.collectionId.name}
                />
                <ItemDetail
                  className="w-1/3"
                  title="Price"
                  value={data.product.price}
                />
                <ItemDetail
                  className="w-1/3"
                  title="Selling Price"
                  value={data.product.sellingPrice}
                />
              </div>

              <div className="flex my-5">
                <ItemDetail
                  className="w-1/3"
                  title="Created At"
                  value={moment(data.product.createdAt).format("DD-MM-YYYY")}
                />
                <ItemDetail
                  className="w-1/3"
                  title="Updated At"
                  value={moment(data.product.updatedAt).format("DD-MM-YYYY")}
                />
              </div>

              {/* photos start */}
              <div>
                <p className='font-semibold mb-2'>Photos</p>
                <div className='flex flex-wrap gap-5'>
                {data.product.photos.map(photo => (
                    <div className='w-[250px]' key={photo.secure_url}>
                        <Image width={250} height={300} className='w-full h-auto' src={photo.secure_url} alt={photo.secure_url} />
                    </div>
                ))}
                </div>
              </div>
                {/* photos end */}

              {/* stock start */}
              <div>
                <p className='font-semibold mb-2 mt-5'>Stock</p>
                <div className='flex gap-3 flex-wrap'>
                {data.product.sizes.map(item => (
                    <ItemDetail key={item.id} className='border rounded-sm p-2' title={item.size} value={`quantity: ${item.quantity}`} />
                ))}
                </div>
                </div>
                {/* stock end */}

                {/* sold start */}
                <div>
                <p className='font-semibold mb-2 mt-5'>Sold</p>
                <div className='flex gap-3 flex-wrap'>
                {data.product.sold.length > 0 ? data.product.sold.map((item, i) => (
                    <ItemDetail key={i} className='border rounded-sm p-2' title={item.size ?? ""} value={`quantity: ${item.quantity}`} />
                )) : (
                    <div>
                        No order yet
                    </div>
                )}
                </div>
                </div>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  )
}

export default ProductDetail