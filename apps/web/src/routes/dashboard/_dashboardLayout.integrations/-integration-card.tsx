import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useMe } from "@/hooks/useUsers";
import { Link } from "@tanstack/react-router";

import { useMutation } from "@tanstack/react-query";
import {
	useConnectToIntegration,
	useDeleteIntegration,
	useDisconnectFromIntegration,
} from "@/hooks/useIntegration";

const integrationMap = {
	github: {
		icon: Github,
		color: "gray-900",
	},
	bitbucket: {
		icon: GitBranch,
		color: "blue-600",
	},
	gitlab: {
		icon: GitCommit,
		color: "orange-600",
	},
	azure: {
		icon: Settings,
		color: "blue-500",
	},
};
export default function IntegrationCard({ integration }: { integration: any }) {
	const { data: meResponse } = useMe();
	const { mutate: connectToIntegration } = useConnectToIntegration();
	const { mutate: deleteIntegration } = useDeleteIntegration();

	const integrationSettings = integrationMap[integration.provider as keyof typeof integrationMap];
	// Get the appropriate icon based on the integration type
	const Icon = integrationSettings?.icon || Settings;

	const isActive = integration.is_active === true;
	const isSelectedIntegration = integration.id === meResponse?.data?.active_integration_id;

	// Give a bit more shadow to the selected integration with the integration color
	const selectedIntegrationShadow = isSelectedIntegration
		? `shadow-xl shadow-${integrationSettings?.color}/50`
		: "";

	return (
		<Card
			className={`transition-all duration-200 ${isActive ? "border-primary/20 bg-card" : "border-muted bg-muted/30"} ${selectedIntegrationShadow}`}
		>
			<CardHeader className="pb-3">
				<div className="flex items-start justify-between">
					<div className="flex items-center gap-3">
						<div
							className={`p-2 rounded-lg bg-${integrationSettings?.color} ${!isActive && "opacity-50"}`}
						>
							<Icon className="h-6 w-6 text-white" />
						</div>
						<div>
							<CardTitle
								className={`text-lg ${!isActive && "text-muted-foreground"}`}
							>
								{integration.title}
							</CardTitle>
							<CardDescription className="text-sm">
								{integration.description}
							</CardDescription>
						</div>
					</div>
					{/* Green badge  */}
					{isSelectedIntegration && (
						<Badge variant="success" className="mr-1">
							<CheckCircle className="h-3 w-3 mr-1" /> Selected
						</Badge>
					)}
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
				{isActive ? (
					<>
						{/* Account Info */}
						<div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
							<Avatar className="h-10 w-10">
								<AvatarImage
									src={integration.avatar_url || "/placeholder.svg"}
									alt={integration.username}
								/>
								<AvatarFallback>
									{integration.username.substring(0, 2).toUpperCase()}
								</AvatarFallback>
							</Avatar>
							<div className="flex-1">
								<p className="font-medium">{integration.username}</p>
								<p className="text-sm text-muted-foreground">{integration.email}</p>
							</div>
							<a
								href={integration.profile_url}
								target="_blank"
								rel="noopener noreferrer"
							>
								<Button variant="ghost" size="sm">
									<ExternalLink className="h-4 w-4" />
								</Button>
							</a>
						</div>

						{/* Stats */}
						<div className="grid grid-cols-3 gap-4">
							<div className="text-center p-3 bg-muted/30 rounded-lg">
								<div className="text-2xl font-bold text-primary">
									{integration.repositories || 5}
								</div>
								<div className="text-xs text-muted-foreground">Repositories</div>
							</div>
							<div className="text-center p-3 bg-muted/30 rounded-lg">
								<div className="text-2xl font-bold text-primary">
									{integration.commits || 5}
								</div>
								<div className="text-xs text-muted-foreground">Commits</div>
							</div>
							<div className="text-center p-3 bg-muted/30 rounded-lg">
								<div className="text-2xl font-bold text-primary">
									{integration.contributors || 5}
								</div>
								<div className="text-xs text-muted-foreground">Contributors</div>
							</div>
						</div>

						{/* Last Sync */}
						<div className="flex items-center gap-2 text-sm text-muted-foreground">
							<Clock className="h-4 w-4" />
							<span>
								Last synced:{" "}
								{new Date(
									integration.last_synced_at || integration.created_at,
								).toLocaleString()}
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
										<DialogTitle>Configure {integration.title}</DialogTitle>
										<DialogDescription>
											Manage your {integration.title} integration settings
										</DialogDescription>
									</DialogHeader>
									<div className="space-y-4 py-4">
										<div className="flex items-center justify-between">
											<Label htmlFor="auto-sync">Auto Sync</Label>
											<Switch
												id="auto-sync"
												checked={integration.settings?.auto_sync}
											/>
										</div>
										<div className="flex items-center justify-between">
											<Label htmlFor="webhooks">Webhooks</Label>
											<Switch
												id="webhooks"
												checked={integration.settings?.webhook}
											/>
										</div>
										<div className="flex items-center justify-between">
											<Label htmlFor="notifications">Notifications</Label>
											<Switch
												id="notifications"
												checked={integration.settings?.notifications}
											/>
										</div>
									</div>
								</DialogContent>
							</Dialog>
							{!isSelectedIntegration ? (
								<Button
									variant="default"
									size="sm"
									className="flex-1"
									onClick={() => connectToIntegration(integration.id)}
								>
									<Plus className="h-4 w-4 mr-2" />
									Connect
								</Button>
							) : null}
							<Button
								variant="destructive"
								size="sm"
								onClick={() => deleteIntegration(integration.id)}
							>
								<Trash2 className="h-4 w-4" />
							</Button>
						</div>
					</>
				) : (
					<>
						{/* Inactive State */}
						<div className="text-center py-6 space-y-3">
							<AlertCircle className="h-12 w-12 text-muted-foreground mx-auto" />
							<div>
								<p className="font-medium text-muted-foreground">Not Connected</p>
								<p className="text-sm text-muted-foreground">
									Connect your {integration.title} account to start tracking
								</p>
							</div>
							<a
								href={`${integration.connection_url}?redirect_url=${window.location.href}`}
							>
								<Button>
									<Plus className="h-4 w-4 mr-2" />
									Connect {integration.title}
								</Button>
							</a>
						</div>
					</>
				)}
			</CardContent>
		</Card>
	);
}
