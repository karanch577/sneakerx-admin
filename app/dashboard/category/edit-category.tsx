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
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { baseUrl } from "@/constants";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

interface EditCategoryProps {
  data: Category;
  refetch: () => void;
}

const formSchema = z.object({
  name: z.string().min(2),
});

function EditCategory({ data, refetch }: EditCategoryProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: data.name,
    },
  });

  const { mutate: editCategory } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const res = await axios.put(`${baseUrl}/category/${data._id}`, values, {
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
    onSuccess: (data: AddCategory) => {
      if (data.success) {
        // reset the form

        form.reset({
          name: data.collection.name,
        });

        refetch();

        return toast({
          variant: "dark",
          title: `${data.collection.name} updated successfully`,
        });
      }
    },
  });

  // submit handler function
  const onSubmit = async (
    values: z.infer<typeof formSchema>
  ): Promise<void> => {
    editCategory(values);
  };
  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger>
          <FilePenLine />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Edit Category Details</AlertDialogTitle>
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

                  <div className="flex justify-between">
                    <Button type="submit">Update</Button>
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
    </>
  );
}

export default EditCategory;
