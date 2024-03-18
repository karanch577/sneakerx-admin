"use client";

import React, { useState } from "react";
import { Card, CardContent, CardTitle } from "./ui/card";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { baseUrl } from "@/constants";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Spinner from "./spinner";

enum SalesRange {
  last7days = "last7days",
  last30days = "last30days",
  last6months = "last6months",
  last12months = "last12months",
}

function Sales() {
  const [range, setRange] = useState<string>(SalesRange.last7days);

  const { data, isPending } = useQuery<TotalSalesRes, AxiosError<ApiCustomError>>({
    queryKey: ["total sales"],
    queryFn: async () => {
      const res = await axios.get(`${baseUrl}/order/total-sales`, {
        withCredentials: true,
      });

      return res.data;
    },
  });

  // fetching total sales by days range
  const { data: rangeData, isPending: isRangePending } = useQuery<
    TotalSalesRes,
    AxiosError<ApiCustomError>
  >({
    queryKey: ["total sales", range],
    queryFn: async () => {
      const res = await axios.get(
        `${baseUrl}/order/total-sales?range=${range}`,
        {
          withCredentials: true,
        }
      );

      return res.data;
    },
  });

  return (
    <div className="mb-5 mx-3">
      <CardTitle className="mb-6">Overview</CardTitle>
      <div className="flex gap-5">
        <Card className="border-black">
          <CardContent className="m-3">
            <p className="mb-5">Total Sales</p>
            {isPending && (
              <div className="ml-3">
                <Spinner />
              </div>
            )}

            {!isPending && <p>&#8377; {data?.sales[0]?.totalSales ?? 0}</p>}
          </CardContent>
        </Card>
        <Card className="border-black">
          <CardContent className="my-3">
            <div className="flex justify-between items-center gap-2">
              <p>Sale</p>
              <Select value={range} onValueChange={(value => setRange(value))}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Range</SelectLabel>
                    <SelectItem value={SalesRange.last7days}>
                      {SalesRange.last7days}
                    </SelectItem>
                    <SelectItem value={SalesRange.last30days}>
                      {SalesRange.last30days}
                    </SelectItem>
                    <SelectItem value={SalesRange.last6months}>
                      {SalesRange.last6months}
                    </SelectItem>
                    <SelectItem value={SalesRange.last12months}>
                      {SalesRange.last12months}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            {isRangePending && (
              <div className="ml-3">
                <Spinner />
              </div>
            )}

            {!isRangePending && <p className="mt-1">
              &#8377; {rangeData?.sales[0]?.totalSales ?? 0}
            </p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Sales;
