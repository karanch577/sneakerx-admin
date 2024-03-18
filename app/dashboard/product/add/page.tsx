"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";
import { baseUrl, productSizes } from "@/constants";

const formSchema = z.object({
  name: z.string().min(2),
  price: z.coerce.number().int().positive(),
  sellingPrice: z.coerce.number().int().positive(),
  sizes: z.array(
    z.object({
      size: z.string(),
      quantity: z.coerce.number().int().min(0),
    })
  ),
  files: typeof window === "undefined" ? z.any() : z.instanceof(FileList),
  collectionId: z.any(),
  description: z.string().min(2),
  colourShown: z.string().min(2),
  style: z.string().min(2),
});

function AddProduct() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: 0,
      sellingPrice: 0,
      sizes: productSizes.map((item) => ({
        size: item,
        quantity: 0,
      })),
      collectionId: "",
      description: "",
      colourShown: "",
      style: "",
    },
  });

  const filesRef = form.register("files");

  // getting the categories

  const { data } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res: AxiosResponse<GetCategoriesRes> = await axios.get(
        `${baseUrl}/category/all`,
        {
          withCredentials: true,
        }
      );
      return res.data;
    },
  });

  const {
    mutate: addProduct,
    isPending
  } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      console.log(values);
      const formData = new FormData();

      // Convert FileList to array
      const filesArray = [...values.files];

      // Append files array to formData under the key "files"
      filesArray.forEach((file, i) => {
        formData.append(`files`, file);
      });

      Object.keys(values).forEach((key) => {
        if (key !== "sizes" && key !== "files") {
          // Append sizes array as it is, without converting to string
          formData.append(key, values[key as keyof typeof values]);
        }
      });

      values.sizes.map((size, i) => {
        formData.append(`sizes[${i}][size]`, size.size);
        formData.append(`sizes[${i}][quantity]`, String(size.quantity));
      });

      const res = await axios.post(`${baseUrl}/product/create`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    },
    onError: (error: AxiosError<ApiCustomError>) => {
      console.log(error);
      if (error.response) {
        return toast({
          variant: "destructive",
          title: error.response.data.message,
        });
      }
    },
    onSuccess: (data) => {
      if (data.success) {
        // reset the form
        form.reset();

        return toast({
          variant: "dark",
          title: `${data.product.name} successfully added`,
        });
      }
    },
  });


  // submit handler function
  const onSubmit = async (
    values: z.infer<typeof formSchema>
  ): Promise<void> => {
    addProduct(values);
  };

  return (
    <div className="mr-16 mt-12">
      <Card>
        <CardHeader>
          <CardTitle>Add Product</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-5">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Price"
                          type="number"
                          {...field}
                          min={0}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sellingPrice"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Selling Price</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Selling Price"
                          type="number"
                          {...field}
                          min={0}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="collectionId"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {data &&
                              data.collections.length > 0 &&
                              data.collections.map((item, i) => (
                                <SelectItem key={i} value={item._id}>
                                  {item.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* photos start */}
              <div>
                <FormField
                  control={form.control}
                  name="files"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Photos</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Selling Price"
                          type="file"
                          multiple
                          {...filesRef}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* photos end */}

              {/* sizes start */}
              <div>
                <p className="mb-2">Add Stock</p>
                <Card>
                  <CardContent className="flex flex-wrap gap-3 mt-6">
                    {productSizes.map((item, i) => (
                      <div key={i} className="flex gap-0 w-[19%]">
                        <FormField
                          control={form.control}
                          name={`sizes.${i}.size`}
                          render={({ field }) => (
                            <FormItem className="">
                              <FormControl>
                                <Input
                                  className="border-none pointer-events-none disabled:opacity-1"
                                  placeholder="Selling Price"
                                  type="string"
                                  {...field}
                                  readOnly
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`sizes.${i}.quantity`}
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormControl>
                                <Input
                                  placeholder="Quantity"
                                  type="number"
                                  {...field}
                                  min={0}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
              {/* sizes end */}

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="colourShown"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Colour Shown</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Colour Shown" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="style"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Style</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Style" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isPending}>Add</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default AddProduct;
