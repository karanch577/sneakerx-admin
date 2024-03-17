"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { baseUrl } from "@/constants";

const formSchema = z.object({
  name: z.string().min(2),
})

function AddCategory() {
  const { toast } = useToast()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    }
  })

  const { mutate:addCategory, isPending, isError, isSuccess } = useMutation({
    mutationFn: async (values:  z.infer<typeof formSchema>) => {
      const res = await axios.post(`${baseUrl}/category/create`, values, {
        withCredentials: true
      })
      return res.data;
    },
    onError: (error: AxiosError<ApiCustomError>) => {
      if(error.response) {
        return toast({
          variant: "destructive",
          title: error.response.data.message
        })
      }
    },
    onSuccess: (data: AddCategory) => {
      if(data.success) {
        // reset the form 
        form.reset()

        return toast({
          variant: "dark",
          title: `${data.collection.name} successfully added`
        })
      }
    }
  })


  // submit handler function
  const onSubmit = async (values: z.infer<typeof formSchema>): Promise<void> => {
    addCategory(values)
  }

  return (
    <div className="mr-16 mt-12">
      <Card>
        <CardHeader>
          <CardTitle>Add Category</CardTitle>
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
        
          <Button type="submit">Add</Button>
      </form>
    </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default AddCategory;
