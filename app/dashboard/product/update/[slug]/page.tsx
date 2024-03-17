"use client";

import React, { useEffect, useState } from "react";
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
import { baseUrl } from "@/constants";
import Spinner from "@/components/spinner";
import DeletePhoto from "./delete-photo";

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
  sold: z.array(
    z.object({
      size: z.string(),
      quantity: z.coerce.number().int().min(0)
    })
  )
});

function UpdateProduct({ params }: { params: { slug: string } }) {
  const { toast } = useToast();
  const [photos, setPhotos] = useState<Photos[]>([])

  //   getting the product detail
  const {
    isPending,
    isError,
    data: productDetail,
    error,
    refetch
  } = useQuery<GetProductDetail, AxiosError<ApiCustomError>>({
    queryKey: ["product", params.slug],
    queryFn: async () => {
      const res = await axios.get(`${baseUrl}/product/id/${params.slug}`, {
        withCredentials: true,
      });
      return res.data;
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: 0,
      sellingPrice: 0,
      sizes: [],
      collectionId: "",
      description: "",
      colourShown: "",
      style: "",
      sold: [],
    },
  });

//   setting the default value after the 

  useEffect(() => {
    // adding all the sizes in the sold array

    productDetail?.product.sizes.forEach(item => {
      if(!productDetail.product.sold.some(el => el.size === item.size)) {
        productDetail.product.sold.push({
          size: item.size,
          quantity: 0
        })
      }
    })
    if (productDetail && productDetail.product) {
      form.reset({
        name: productDetail.product.name,
        price: productDetail.product.price,
        sellingPrice: productDetail.product.sellingPrice,
        sizes: productDetail.product.sizes.map((item) => ({
          size: item.size,
          quantity: item.quantity,
        })),
        collectionId: productDetail.product.collectionId._id,
        description: productDetail.product.description,
        colourShown: productDetail.product.colourShown,
        style: productDetail.product.style,
        sold: productDetail.product.sold.map((item) => ({
          size: item.size,
          quantity: item.quantity,
        })),
      });
    }
  }, [productDetail, form]);


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

  const { mutate: addProduct } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
    // preventing all photos removal
    if(photos.length === productDetail?.product.photos.length) {
        return toast({
            variant: "destructive",
            title: "Can't remove all the photo, keep atleast one"
        })
    }

    // handling photos remove 
    if(photos.length) {
        setPhotos([])
        await axios.patch(`${baseUrl}/product/updatePhotos/${params.slug}`, {
            photos: photos
        }, {
            withCredentials: true
        })
    }

      const formData = new FormData();

      console.log("files", values.files)

      // Convert FileList to array
      const filesArray = [...values.files];

      console.log("filesArray", filesArray)

      // Append files array to formData under the key "files"
      filesArray.forEach((file, i) => {
        formData.append(`files`, file);
      });

      
      Object.keys(values).forEach((key) => {
        if (key !== "sizes" && key !== "files" && key !== "sold") {
          // Append sizes array as it is, without converting to string
          formData.append(key, values[key as keyof typeof values]);
        }
      });
      
      values.sizes.map((size, i) => {
        formData.append(`sizes[${i}][size]`, size.size);
        formData.append(`sizes[${i}][quantity]`, String(size.quantity));
      });
      
      values.sold.map((size, i) => {
        formData.append(`sold[${i}][size]`, size.size);
        formData.append(`sold[${i}][quantity]`, String(size.quantity));
      });
      
      const res = await axios.patch(`${baseUrl}/product/update/${params.slug}`, formData, {
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
        refetch()
        form.reset()

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
          <CardTitle>Update Product</CardTitle>
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

          {!isError && !isPending && data && productDetail && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
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
                          <Select onValueChange={field.onChange} defaultValue={productDetail.product.collectionId._id}>
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
                    <p>Photos</p>
                    <div className="flex flex-wrap gap-5">
                        {productDetail.product.photos && productDetail.product.photos.map(photo => (
                            <DeletePhoto key={photo.secure_url} photo={photo} photos={photos} setPhotos={setPhotos} />
                        ))}
                    </div>
                  <FormField
                    control={form.control}
                    name="files"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Add Photos</FormLabel>
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
                  <p className="mb-2">Update Stock</p>
                  <Card>
                      <p className="mx-3 mt-2">Remaining Products</p>
                    <CardContent className="flex flex-wrap gap-3 mt-6">
                      {productDetail.product.sizes.map((item, i) => (
                        <div key={i} className="flex gap-0 w-[19%]">
                          <FormField
                            control={form.control}
                            name={`sizes.${i}.size`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    className="border-none pointer-events-none disabled:opacity-1 focus:boder-none focus:outline-none"
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

                {/* sold start */}
                <div>
                  <Card>
                      <p className="mx-3 mt-2">Sold Products</p>
                    <CardContent className="flex flex-wrap gap-3 mt-6">
                      {productDetail.product.sold.map((item, i) => (
                        <div key={i} className="flex gap-0 w-[19%]">
                          <FormField
                            control={form.control}
                            name={`sold.${i}.size`}
                            render={({ field }) => (
                              <FormItem>
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
                            name={`sold.${i}.quantity`}
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
                {/* sold products end */}

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

                <Button type="submit">Update</Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default UpdateProduct;
