"use client";

import React, { ReactNode, useEffect } from "react";
import { Form as ShadCNForm, FormMessage } from "@/components/ui/form";
import { FieldValues, type UseFormReturn } from "react-hook-form";
import { ZodType } from "zod";
import { cn } from "@/lib/utils";

type Props<TFormValues extends FieldValues> = {
	children: React.ReactNode;
	onSubmit?: (values: TFormValues) => any;
	className?: string;
	form: UseFormReturn<TFormValues> & { schema?: ZodType<TFormValues> };
};

const Form = <TFormValues extends FieldValues>(props: Props<TFormValues>) => {
	const { className, children, form, onSubmit } = props;
	const generalError = form.formState?.errors?.error;

	const submitFn = async (data: TFormValues) => {
		if (onSubmit) {
			await onSubmit(data);
		}
	};
	return (
		<ShadCNForm {...form}>
			{children}
			<form onSubmit={form.handleSubmit(submitFn)} className={cn(className)}>
				<div className={cn("w-full")}>
					{children}
					{generalError && (
						<FormMessage className="!mb-0 !mt-2">
							{generalError.message as ReactNode}
						</FormMessage>
					)}
				</div>
			</form>
		</ShadCNForm>
	);
};

export default Form;
