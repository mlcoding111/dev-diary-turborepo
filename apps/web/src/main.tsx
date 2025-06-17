import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuth, AuthProvider } from "./auth.tsx";
import reportWebVitals from "./reportWebVitals.ts";
import { CookiesProvider } from 'react-cookie';
import "./styles.css";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			refetchOnMount: false,
			refetchOnReconnect: false,
			retry: 1,
			staleTime: 1000 * 60 * 5,
		},
	},
});

// Create a new router instance
const router = createRouter({
	routeTree,
	context: {
		queryClient,
		auth: undefined!,
	},
	defaultPreload: "intent",
	scrollRestoration: true,
	defaultStructuralSharing: true,
	defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

function InnerApp() {
	const auth = useAuth();
	return (
		<main>
			<RouterProvider router={router} context={{ auth }} />
		</main>
	);
}

function App() {
	const createUserDto: CreateUserDto = {
		email: "test@test.com",
		name: "Test User",
	};
	const serializedApiResponse: SerializedApiResponse<CreateUserDto> = {
		http_status_code: 200,
		message: "User created successfully",
		data: createUserDto,
	};
	console.log(createUserDto);

	return (
		<AuthProvider>
			 <CookiesProvider defaultSetOptions={{ path: '/' }}>
				<InnerApp />
			 </CookiesProvider>
		</AuthProvider>
	);
}

// Render the app
const rootElement = document.getElementById("app");
if (rootElement && !rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<QueryClientProvider client={queryClient}>
			<App />
		</QueryClientProvider>,
	);
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
