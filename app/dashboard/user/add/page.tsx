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
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";
import { baseUrl } from "@/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.string().min(2),
});

function AddUser() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "",
    },
  });

  // getting the user roles

  const { data: userRoles } = useQuery({
    queryKey: ["user-roles"],
    queryFn: async () => {
      const res: AxiosResponse<GetUserRoles> = await axios.get(
        `${baseUrl}/user/role`,
        {
          withCredentials: true,
        }
      );
      return res.data;
    },
  });

  const {
    mutate: addUser,
    isPending,
    isError,
    isSuccess,
  } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const res = await axios.post(`${baseUrl}/user/create`, values, {
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
    onSuccess: (data: LoginData) => {
      if (data.success) {
        // reset the form
        form.reset();

        return toast({
          variant: "dark",
          title: `${data.user.name} successfully added`,
        });
      }
    },
  });

  // submit handler function
  const onSubmit = async (
    values: z.infer<typeof formSchema>
  ): Promise<void> => {
    addUser(values);
  };

  return (
    <div className="mr-16 mt-12">
      <Card>
        <CardHeader>
          <CardTitle>Add User</CardTitle>
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
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {userRoles?.roles &&
                          userRoles.roles.length > 0 &&
                          userRoles.roles.map((item, i) => (
                            <SelectItem key={i} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
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

export default AddUser;
