import { useAuth } from "@/auth";
import { LoginForm } from "@/components/login-form";
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { z } from "zod";
import { useEffect } from "react";
import { useCookies } from 'react-cookie';
const fallback = "/dashboard" as const;

// overview https://template-04-dashboard.vercel.app/
export const Route = createFileRoute("/_auth/login")({
	validateSearch: z.object({
		code: z.string().optional(),
		redirect: z.string().optional(),
	}),
	beforeLoad: ({ context, search }) => {
		if (context.auth.isAuthenticated) {
			throw redirect({ to: search.redirect || fallback });
		}
	},
	component: LoginComponent,
});

function LoginComponent() {
	const auth = useAuth();
	const router = useRouter();
	const navigate = Route.useNavigate();
	const search = Route.useSearch(); // ✅ Get query params here
	const [cookies, setCookie, removeCookie] = useCookies(['access_token']);
	console.log(search.code); // logs "5343" if ?code=5343 is in the URL

	useEffect(() => {
		console.log('Myu cookie is', cookies.access_token)
		if (search.code) {
			test();
		}
	}, []);

	async function test() {
		await auth.login("my-name")
	}
	return (
		<div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
			<div className="flex w-full max-w-sm flex-col gap-6">
				<a href="#" className="flex items-center gap-2 self-center font-medium">
					MLWeb Inc.
				</a>
				<LoginForm />
			</div>
		</div>
	);
}
