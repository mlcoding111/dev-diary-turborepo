// CLIENT COMPONENT
"use client";

import { signup } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TRegisterUser, registerUserSchema } from "@repo/types/schema";
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

export function SignupForm() {
  const form = useForm<TRegisterUser>({
    resolver: zodResolver(registerUserSchema),
    defaultValues: {
      email: '',
      password: '',
      first_name: '',
      last_name: '',
    },	
  });

  const onSubmit = async (data: TRegisterUser) => {
    console.log(data);
    await signup(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField 
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
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
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />	
            </FormItem>
          )}
        />
        <FormField 
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField 
          control={form.control}
          name="last_name"	
          render={({ field }) => (	
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>		
          )}
        />
		{/* Get the api response and display response.message */}

        <Button type="submit">Sign Up</Button>
      </form>
    </Form>
  );
}
