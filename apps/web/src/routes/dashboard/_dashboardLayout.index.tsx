import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/dashboard/_dashboardLayout/")({
	component: RouteComponent,
});

export function RouteComponent() {
	return <Outlet />;
}
