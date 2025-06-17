export default function DashboardPageLayout({
	children,
	rightContent,
	title,
	description,
}: {
	children: React.ReactNode;
	rightContent?: React.ReactNode;
	title: string;
	description: string;
}) {
	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">{title}</h1>
					<p className="text-muted-foreground">
						{description}
					</p>
				</div>
				<div className="flex items-center gap-2">
					{rightContent}
				</div>
			</div>
			{children}
		</div>
	);
}
