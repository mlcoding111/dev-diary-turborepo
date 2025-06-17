"use client";

import { useState } from "react";
import {
	Github,
	GitBranch,
	Settings,
	Plus,
	CheckCircle,
	XCircle,
	Clock,
	Users,
	GitCommit,
	AlertCircle,
	ExternalLink,
	Trash2,
	RefreshCw,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardPageLayout from "../-dashboard-page-layout";
import { Link } from "@tanstack/react-router";  
import { getIntegrations, getIntegrationsList } from "@/api/integration";
import { useQuery } from "@tanstack/react-query";

// Mock integration data
const mockIntegrations = [
	{
		id: "github-1",
		name: "GitHub",
		type: "github",
		status: "active",
		description: "Connect your GitHub repositories for commit tracking and analytics",
		icon: Github,
		color: "bg-gray-900",
		connectedAt: "2024-01-10T10:30:00Z",
		lastSync: "2024-01-15T14:20:00Z",
		repositories: 12,
		commits: 1247,
		contributors: 8,
		account: {
			username: "your-org",
			avatar: "/placeholder.svg?height=40&width=40",
			email: "admin@yourorg.com",
		},
		settings: {
			autoSync: true,
			webhooks: true,
			notifications: false,
		},
	},
	{
		id: "bitbucket-1",
		name: "Bitbucket",
		type: "bitbucket",
		status: "active",
		description: "Integrate with Bitbucket for comprehensive repository management",
		icon: GitBranch,
		color: "bg-blue-600",
		connectedAt: "2024-01-08T09:15:00Z",
		lastSync: "2024-01-15T13:45:00Z",
		repositories: 6,
		commits: 834,
		contributors: 5,
		account: {
			username: "bitbucket-team",
			avatar: "/placeholder.svg?height=40&width=40",
			email: "team@bitbucket.com",
		},
		settings: {
			autoSync: true,
			webhooks: false,
			notifications: true,
		},
	},
	{
		id: "gitlab-1",
		name: "GitLab",
		type: "gitlab",
		status: "inactive",
		description: "Connect GitLab for complete DevOps lifecycle management",
		icon: GitCommit,
		color: "bg-orange-600",
		connectedAt: null,
		lastSync: null,
		repositories: 0,
		commits: 0,
		contributors: 0,
		account: null,
		settings: {
			autoSync: false,
			webhooks: false,
			notifications: false,
		},
	},
	{
		id: "azure-1",
		name: "Azure DevOps",
		type: "azure",
		status: "inactive",
		description: "Integrate with Azure DevOps for enterprise-grade development tools",
		icon: Settings,
		color: "bg-blue-500",
		connectedAt: null,
		lastSync: null,
		repositories: 0,
		commits: 0,
		contributors: 0,
		account: null,
		settings: {
			autoSync: false,
			webhooks: false,
			notifications: false,
		},
	},
];

export default function IntegrationsPage() {

	const { data: integrationsList } = useQuery({
		queryKey: ["integrations"],
		queryFn: getIntegrationsList,
	});

	console.log(integrationsList);

	const [integrations, setIntegrations] = useState(mockIntegrations);
	const [selectedIntegration, setSelectedIntegration] = useState<
		(typeof mockIntegrations)[0] | null
	>(null);
	const [isConnecting, setIsConnecting] = useState<string | null>(null);

	const activeIntegrations = integrations.filter((i) => i.status === "active");
	const inactiveIntegrations = integrations.filter((i) => i.status === "inactive");

	const handleConnect = async (integrationId: string) => {
		setIsConnecting(integrationId);
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 2000));

		setIntegrations((prev) =>
			prev.map((integration) =>
				integration.id === integrationId
					? {
							...integration,
							status: "active" as const,
							connectedAt: new Date().toISOString(),
							lastSync: new Date().toISOString(),
						}
					: integration,
			),
		);
		setIsConnecting(null);
	};

	const handleDisconnect = (integrationId: string) => {
		setIntegrations((prev) =>
			prev.map((integration) =>
				integration.id === integrationId
					? {
							...integration,
							status: "inactive" as const,
							connectedAt: null,
							lastSync: null,
							repositories: 0,
							commits: 0,
							contributors: 0,
							account: null,
						}
					: integration,
			),
		);
	};

	const handleSettingChange = (integrationId: string, setting: string, value: boolean) => {
		setIntegrations((prev) =>
			prev.map((integration) =>
				integration.id === integrationId
					? {
							...integration,
							settings: { ...integration.settings, [setting]: value },
						}
					: integration,
			),
		);
	};

	const IntegrationCard = ({ integration }: { integration: (typeof mockIntegrations)[0] }) => {
		const Icon = integration.icon;
		const isActive = integration.status === "active";
		const isConnectingIntegration = isConnecting === integration.id;

		return (
			<Card
				className={`transition-all duration-200 ${isActive ? "border-primary/20 bg-card" : "border-muted bg-muted/30"}`}
			>
				<CardHeader className="pb-3">
					<div className="flex items-start justify-between">
						<div className="flex items-center gap-3">
							<div
								className={`p-2 rounded-lg ${integration.color} ${!isActive && "opacity-50"}`}
							>
								<Icon className="h-6 w-6 text-white" />
							</div>
							<div>
								<CardTitle
									className={`text-lg ${!isActive && "text-muted-foreground"}`}
								>
									{integration.name}
								</CardTitle>
								<CardDescription className="text-sm">
									{integration.description}
								</CardDescription>
							</div>
						</div>
						<Badge variant={isActive ? "default" : "secondary"} className="capitalize">
							{isActive ? (
								<>
									<CheckCircle className="h-3 w-3 mr-1" /> Active
								</>
							) : (
								<>
									<XCircle className="h-3 w-3 mr-1" /> Inactive
								</>
							)}
						</Badge>
					</div>
				</CardHeader>

				<CardContent className="space-y-4">
					{isActive && integration.account ? (
						<>
							{/* Account Info */}
							<div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
								<Avatar className="h-10 w-10">
									<AvatarImage
										src={integration.account.avatar || "/placeholder.svg"}
										alt={integration.account.username}
									/>
									<AvatarFallback>
										{integration.account.username.substring(0, 2).toUpperCase()}
									</AvatarFallback>
								</Avatar>
								<div className="flex-1">
									<p className="font-medium">{integration.account.username}</p>
									<p className="text-sm text-muted-foreground">
										{integration.account.email}
									</p>
								</div>
								<Button variant="ghost" size="sm">
									<ExternalLink className="h-4 w-4" />
								</Button>
							</div>

							{/* Stats */}
							<div className="grid grid-cols-3 gap-4">
								<div className="text-center p-3 bg-muted/30 rounded-lg">
									<div className="text-2xl font-bold text-primary">
										{integration.repositories}
									</div>
									<div className="text-xs text-muted-foreground">
										Repositories
									</div>
								</div>
								<div className="text-center p-3 bg-muted/30 rounded-lg">
									<div className="text-2xl font-bold text-primary">
										{integration.commits}
									</div>
									<div className="text-xs text-muted-foreground">Commits</div>
								</div>
								<div className="text-center p-3 bg-muted/30 rounded-lg">
									<div className="text-2xl font-bold text-primary">
										{integration.contributors}
									</div>
									<div className="text-xs text-muted-foreground">
										Contributors
									</div>
								</div>
							</div>

							{/* Last Sync */}
							<div className="flex items-center gap-2 text-sm text-muted-foreground">
								<Clock className="h-4 w-4" />
								<span>
									Last synced: {new Date(integration.lastSync!).toLocaleString()}
								</span>
								<Button variant="ghost" size="sm" className="ml-auto">
									<RefreshCw className="h-4 w-4" />
								</Button>
							</div>

							{/* Actions */}
							<div className="flex gap-2 pt-2">
								<Dialog>
									<DialogTrigger asChild>
										<Button variant="outline" size="sm" className="flex-1">
											<Settings className="h-4 w-4 mr-2" />
											Configure
										</Button>
									</DialogTrigger>
									<DialogContent className="max-w-md">
										<DialogHeader>
											<DialogTitle>Configure {integration.name}</DialogTitle>
											<DialogDescription>
												Manage your {integration.name} integration settings
											</DialogDescription>
										</DialogHeader>
										<div className="space-y-4 py-4">
											<div className="flex items-center justify-between">
												<Label htmlFor="auto-sync">Auto Sync</Label>
												<Switch
													id="auto-sync"
													checked={integration.settings.autoSync}
													onCheckedChange={(checked) =>
														handleSettingChange(
															integration.id,
															"autoSync",
															checked,
														)
													}
												/>
											</div>
											<div className="flex items-center justify-between">
												<Label htmlFor="webhooks">Webhooks</Label>
												<Switch
													id="webhooks"
													checked={integration.settings.webhooks}
													onCheckedChange={(checked) =>
														handleSettingChange(
															integration.id,
															"webhooks",
															checked,
														)
													}
												/>
											</div>
											<div className="flex items-center justify-between">
												<Label htmlFor="notifications">Notifications</Label>
												<Switch
													id="notifications"
													checked={integration.settings.notifications}
													onCheckedChange={(checked) =>
														handleSettingChange(
															integration.id,
															"notifications",
															checked,
														)
													}
												/>
											</div>
										</div>
									</DialogContent>
								</Dialog>
								<Button
									variant="destructive"
									size="sm"
									onClick={() => handleDisconnect(integration.id)}
								>
									<Trash2 className="h-4 w-4 mr-2" />
									Disconnect
								</Button>
							</div>
						</>
					) : (
						<>
							{/* Inactive State */}
							<div className="text-center py-6 space-y-3">
								<AlertCircle className="h-12 w-12 text-muted-foreground mx-auto" />
								<div>
									<p className="font-medium text-muted-foreground">
										Not Connected
									</p>
									<p className="text-sm text-muted-foreground">
										Connect your {integration.name} account to start tracking
									</p>        
								</div>
                                <a href={`http://localhost:3001/auth/github`}>
                                    <Button>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Connect {integration.name}
                                    </Button>
                                </a>
								{/* <Button
									onClick={() => handleConnect(integration.id)}
									// onClick={() => handleConnect(integration.id)}
									disabled={isConnecting}
									className="w-full"
								>
									{isConnecting ? (
										<>
											<RefreshCw className="h-4 w-4 mr-2 animate-spin" />
											Connecting...
										</>
									) : (
										<>
											<Plus className="h-4 w-4 mr-2" />
											Connect {integration.name}
										</>
									)}
								</Button> */}
							</div>
						</>
					)}
				</CardContent>
			</Card>
		);
	};

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
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
									{activeIntegrations.reduce((sum, i) => sum + i.repositories, 0)}
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
									{activeIntegrations.reduce((sum, i) => sum + i.commits, 0)}
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
									{activeIntegrations.reduce((sum, i) => sum + i.contributors, 0)}
								</p>
								<p className="text-sm text-muted-foreground">Contributors</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

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
						{integrations.map((integration) => (
							<IntegrationCard key={integration.id} integration={integration} />
						))}
					</div>
				</TabsContent>

				<TabsContent value="active" className="space-y-4">
					{activeIntegrations.length > 0 ? (
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							{activeIntegrations.map((integration) => (
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
						{inactiveIntegrations.map((integration) => (
							<IntegrationCard key={integration.id} integration={integration} />
						))}
					</div>
				</TabsContent>
			</Tabs>
		</DashboardPageLayout>
	);
}
