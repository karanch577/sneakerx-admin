import React from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { FilePenLine } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";
import { baseUrl } from "@/constants";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface EditUserProps {
  data: User;
  refetch: () => void;
}

const formSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  role: z.string().min(2),
});

function EditUser({ data, refetch }: EditUserProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: data.name,
      email: data.email,
      role: data.role,
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

  const { mutate: editUser, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const res = await axios.patch(
        `${baseUrl}/user/update/${data._id}`,
        values,
        {
          withCredentials: true,
        }
      );
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
    onSuccess: (data: UpdateUser) => {
      if (data.success) {
        // reset the form

        form.reset({
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
        });

        refetch();

        return toast({
          variant: "dark",
          title: `${data.user.name} updated successfully`,
        });
      }
    },
  });

  // submit handler function
  const onSubmit = async (
    values: z.infer<typeof formSchema>
  ): Promise<void> => {
    editUser(values);
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <FilePenLine />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Edit User Details</AlertDialogTitle>
          <AlertDialogDescription>
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
                  name="role"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-4">
                      <FormLabel className="relative top-1">role</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex "
                        >
                        {userRoles && userRoles.roles.length > 0 && userRoles.roles.map((item, i) => (
                            <FormItem key={i} className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value={item} />
                            </FormControl>
                            <FormLabel className="font-normal">
                                {item}
                            </FormLabel>
                          </FormItem>
                        ))}
                          
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-between">
                  <Button type="submit" disabled={isPending}>Update</Button>
                  <AlertDialogCancel onClick={() => form.reset()}>
                    Cancel
                  </AlertDialogCancel>
                </div>
              </form>
            </Form>
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default EditUser;
