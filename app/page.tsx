"use client";

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
import useUserStore from "@/store/useUserStore";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useToast } from "@/components/ui/use-toast";
import { baseUrl } from "@/constants";
import Link from "next/link";


const formSchema = z.object({
  email: z.string().email("you must enter a valid email"),
  password: z.string().min(6)
})


function Login() {
  const addUser = useUserStore((state) => state.addUser)
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  })

  const { mutate:handleLogin, isPending } = useMutation({
    mutationFn: async (values:  z.infer<typeof formSchema>) => {
      const res = await axios.post(`${baseUrl}/user/signin`, values, {
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
    onSuccess: (data: LoginData) => {
      if(data.success && data.user.role !== "ADMIN") {
        return toast({
          variant: "destructive",
          title: "Only admin can access the dashboard"
        })
      }

      if(data.success && data.user.role === "ADMIN") {
        // storing the user
        addUser(data.user)
    
        // setting isLoggedIn to true in localStorage
        localStorage.setItem("isLoggedIn", JSON.stringify(true))
        router.push("/dashboard")
      }
    }
  })

 

  // submit handler function
  const onSubmit = async (values: z.infer<typeof formSchema>): Promise<void> => {
    handleLogin(values)
  }

  return (
    <div className="p-5 sm:p-0 sm:w-[400px] mx-auto min-h-screen flex flex-col justify-center">
      <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-12">
      SneakerX Admin Dashboard
    </h2>
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
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
              <div className="flex justify-between">
              <FormLabel>Password</FormLabel>
              {/* <Link className="text-sm underline" href={"./forgot-password"}>Forgot password?</Link> */}
              </div>
              <FormControl>
                <Input placeholder="Password" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
          <div className="flex justify-between gap-5">
            <Button type="submit" disabled={isPending}>Login</Button>
            <div className="w-1/2 text-sm text-right">
              <span>Don&#39;t have an account? </span>
              <Link className="underline" href={"./register"}>Create now</Link>
            </div>
          </div>
      </form>
    </Form>
    </div>
  )
}

export default Login