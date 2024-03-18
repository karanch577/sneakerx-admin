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
import { Switch } from "@/components/ui/switch";

interface EditCouponProps {
  data: Coupon;
  refetch: () => void;
}

const formSchema = z.object({
  code: z.string().min(2),
  discount: z.coerce.number(),
  active: z.boolean(),
});

function EditCoupon({ data, refetch }: EditCouponProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: data.code,
      discount: data.discount,
      active: data.active,
    },
  });

  const { mutate: editCoupon, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const res = await axios.put(
        `${baseUrl}/coupon/update/${data._id}`,
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
    onSuccess: (data: AddCoupon) => {
      if (data.success) {
        // reset the form

        form.reset({
          code: data.coupon.code,
          discount: data.coupon.discount,
          active: data.coupon.active,
        });

        refetch();

        return toast({
          variant: "dark",
          title: `${data.coupon.code} updated successfully`,
        });
      }
    },
  });

  // submit handler function
  const onSubmit = async (
    values: z.infer<typeof formSchema>
  ): Promise<void> => {
    editCoupon(values);
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <FilePenLine />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Edit Coupon Details</AlertDialogTitle>
          <AlertDialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="code"
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
                  name="discount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Discount"
                          type="number"
                          {...field}
                          min={0}
                          max={100}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-4">
                      <FormLabel className="relative top-1">isActive</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
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

export default EditCoupon;
