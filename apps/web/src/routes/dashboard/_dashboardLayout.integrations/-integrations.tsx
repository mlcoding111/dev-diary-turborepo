import { GitBranch, Plus, CheckCircle, Users, GitCommit, AlertCircle } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardPageLayout from "../-dashboard-page-layout";
import { useFormattedIntegrations } from "@/hooks/useIntegration";
import IntegrationCard from "./-integration-card";
import { useMe } from "@/hooks/useUsers";

export default function IntegrationsPage() {
	const { data: meResponse } = useMe();
	const { data: response, isFetching } = useFormattedIntegrations();
	const integrations = response?.data;

	// Sort integrations to put selected integration first
	const sortedIntegrations = integrations?.sort((a: any, b: any) => {
		if (a.id === meResponse?.data?.active_integration_id) return -1;
		if (b.id === meResponse?.data?.active_integration_id) return 1;
		return 0;
	});

	const activeIntegrations = sortedIntegrations?.filter((i: any) => i.is_active === true);
	const inactiveIntegrations = sortedIntegrations?.filter((i: any) => i.is_active === false);

	if (isFetching) return <div>Loading...</div>;

	return (
		<DashboardPageLayout
			title="Integrations"
			description="Connect and manage your development tools and repositories"
			rightContent={
				<>
					<Badge variant="secondary" className="text-sm">
						{activeIntegrations.length} active
					</Badge>
					<Button>
						<Plus className="h-4 w-4 mr-2" />
						Add Integration
					</Button>
				</>
			}
		>
			{/* Overview Stats */}
			{/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<Card>
					<CardContent className="p-6">
						<div className="flex items-center gap-2">
							<CheckCircle className="h-5 w-5 text-green-500" />
							<div>
								<p className="text-2xl font-bold">{activeIntegrations.length}</p>
								<p className="text-sm text-muted-foreground">Active Integrations</p>
							</div>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-6">
						<div className="flex items-center gap-2">
							<GitCommit className="h-5 w-5 text-blue-500" />
							<div>
								<p className="text-2xl font-bold">
									{activeIntegrations.reduce(
										(sum: number, i: any) => sum + i.repositories,
										0,
									) || 5}
								</p>
								<p className="text-sm text-muted-foreground">Total Repositories</p>
							</div>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-6">
						<div className="flex items-center gap-2">
							<GitBranch className="h-5 w-5 text-purple-500" />
							<div>
								<p className="text-2xl font-bold">
									{activeIntegrations.reduce(
										(sum: number, i: any) => sum + i.commits,
										0,
									) || 5}
								</p>
								<p className="text-sm text-muted-foreground">Total Commits</p>
							</div>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-6">
						<div className="flex items-center gap-2">
							<Users className="h-5 w-5 text-orange-500" />
							<div>
								<p className="text-2xl font-bold">
									{activeIntegrations.reduce(
										(sum: number, i: any) => sum + i.contributors,
										0,	
									) || 5}
								</p>
								<p className="text-sm text-muted-foreground">Contributors</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div> */}

			{/* Integrations Tabs */}
			<Tabs defaultValue="all" className="space-y-4">
				<TabsList>
					<TabsTrigger value="all">All Integrations</TabsTrigger>
					<TabsTrigger value="active">Active ({activeIntegrations.length})</TabsTrigger>
					<TabsTrigger value="inactive">
						Available ({inactiveIntegrations.length})
					</TabsTrigger>
				</TabsList>

				<TabsContent value="all" className="space-y-4">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						{sortedIntegrations.map((integration: any) => (
							<IntegrationCard key={integration.id} integration={integration} />
						))}
					</div>
				</TabsContent>

				<TabsContent value="active" className="space-y-4">
					{activeIntegrations.length > 0 ? (
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							{activeIntegrations.map((integration: any) => (
								<IntegrationCard key={integration.id} integration={integration} />
							))}
						</div>
					) : (
						<Card>
							<CardContent className="text-center py-12">
								<AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
								<h3 className="text-lg font-medium mb-2">No Active Integrations</h3>
								<p className="text-muted-foreground mb-4">
									Connect your first integration to start tracking your
									repositories
								</p>
								<Button>
									<Plus className="h-4 w-4 mr-2" />
									Add Integration
								</Button>
							</CardContent>
						</Card>
					)}
				</TabsContent>

				<TabsContent value="inactive" className="space-y-4">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						{inactiveIntegrations.map((integration: any) => (
							<IntegrationCard key={integration.id} integration={integration} />
						))}
					</div>
				</TabsContent>
			</Tabs>
		</DashboardPageLayout>
	);
}
