"use client";

import ItemDetail from "@/components/item-detail";
import Spinner from "@/components/spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { baseUrl } from "@/constants";
import { useQueries, useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import moment from "moment";
import Image from "next/image";
import React from "react";

function OrderDetail({ params }: { params: { slug: string } }) {
  const { isPending, isError, data, error } = useQuery<
    GetOrderDetail,
    AxiosError<ApiCustomError>
  >({
    queryKey: ["order", params.slug],
    queryFn: async () => {
      const res = await axios.get(`${baseUrl}/order/id/${params.slug}`, {
        withCredentials: true,
      });
      return res.data;
    },
  });

  const products = useQueries({
    queries: data ? data.order.products.map((product) => {
      return {
        queryKey: ["product", product._id],
        queryFn: async () => {
            const res = await axios.get(`${baseUrl}/product/id/${product.productId}`)

            return {...res.data, ...product}
        }
      };
    }): [],
  });


  return (
    <div className="mr-16 mt-12">
      <Card>
        <CardHeader>
          <CardTitle>Order Detail</CardTitle>
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
                  title="Order Id"
                  value={data.order._id}
                />
                <ItemDetail
                  className="w-1/3"
                  title="Order By"
                  value={data.order.user.name}
                />
                <ItemDetail
                  className="w-1/3"
                  title="Phone No."
                  value={data.order.phoneNumber}
                />
              </div>

              <div className="flex my-5">
                <ItemDetail
                  className="w-1/3"
                  title="Address"
                  value={data.order.address}
                />
                <ItemDetail
                  className="w-1/3"
                  title="Total Amount"
                  value={data.order.amount}
                />
                <ItemDetail
                  className="w-1/3"
                  title="Coupon Applied"
                  value={data.order.coupon ?? "none"}
                />
              </div>

              <div className="flex">
                <ItemDetail
                  className="w-1/3"
                  title="Transaction Status"
                  value={data.order.transactionStatus}
                />
                <ItemDetail
                  className="w-1/3"
                  title="Transaction Id"
                  value={data.order.transactionId ?? "null"}
                />
                <ItemDetail
                  className="w-1/3"
                  title="Order Status"
                  value={data.order.status}
                />
              </div>

              <div className="flex my-5">
                <ItemDetail
                  className="w-1/3"
                  title="Created At"
                  value={moment(data.order.createdAt).format("DD-MM-YYYY")}
                />
                <ItemDetail
                  className="w-1/3"
                  title="Updated At"
                  value={moment(data.order.updatedAt).format("DD-MM-YYYY")}
                />
              </div>
            </div>
          )}

          {/* orders products */}
          <div>
            <p className="font-semibold">Orderd {products.length === 1 ? "Product" : "Products"}</p>
            <div className="products flex gap-5 mt-2 overflow-auto">
              {products && products.length > 0 && products[0].data?.product && products.map(item => (
                <div key={item.data.product._id} className="w-[220px]">
                  <div className="w-[220px] flex justify-center">
                    <Image width={250} height={300} className="h-full w-auto" src={item.data.product.photos[0].secure_url} alt={item.data.product.name} />
                  </div>
                  <div className="m-2">
                  <p>{item.data.product.name}</p>
                  <div className="flex justify-between">
                    <p>size: {item.data.size}</p>
                    <p>count: {item.data.count}</p>
                  </div>
                  <p>price: &#8377;{item.data.price.toLocaleString("en-IN")}</p>
                  </div>
                  
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default OrderDetail;
