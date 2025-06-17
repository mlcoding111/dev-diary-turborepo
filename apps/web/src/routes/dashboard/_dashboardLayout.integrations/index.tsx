import { createFileRoute } from "@tanstack/react-router";
import IntegrationsPage from "./-integrations";

export const Route = createFileRoute("/dashboard/_dashboardLayout/integrations/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <IntegrationsPage />;
}
