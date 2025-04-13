"use client";

import React, { ReactNode, useState } from "react";
import { Form as ShadCNForm, FormMessage } from "@/components/ui/form";
import { FieldValues, type UseFormReturn } from "react-hook-form";
import { ZodType } from "zod";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Props<TFormValues extends FieldValues> = {
	children: React.ReactNode;
	onSubmit?: (values: TFormValues) => unknown;
	className?: string;
	form: UseFormReturn<TFormValues> & { schema?: ZodType<TFormValues> };
	toastOnError?: boolean;
};

const Form = <TFormValues extends FieldValues>(props: Props<TFormValues>) => {
	const { className, children, form, onSubmit, toastOnError = true } = props;
	const generalError = form.formState?.errors?.error;
	const [apiErrorMessage, setApiErrorMessage] = useState<string | null>(null);

	const submitFn = async (data: TFormValues) => {
		if (onSubmit) {
			const result: any = await onSubmit(data);
			if (!result.success) {
				if (toastOnError) {
					toast.error(result.message);
				} else {
					setApiErrorMessage(result.message);
				}
			}
		}
	};
	return (
		<ShadCNForm {...form}>
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
