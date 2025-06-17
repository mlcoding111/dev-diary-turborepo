import { useGitRepositories } from "@/hooks/useGit";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

export default function RepositorySelector() {
	const { data: response, isLoading } = useGitRepositories();

	if (isLoading) return <Skeleton className="w-full h-10" />;

	if (!response?.data) return <div>No repositories found</div>;

	return (
		<div className="w-full">
			<Select>
				<SelectTrigger className="w-full">
					<SelectValue placeholder="Select a repository" />
				</SelectTrigger>
				<SelectContent>
					{response?.data.map((repository: any) => (
						<SelectItem key={repository.id} value={repository.id}>
							{repository.name}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}
