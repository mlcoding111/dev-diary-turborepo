import { getCommits } from "@/api/git";
import { getRepository } from "@/api/repositories";
import { getRepositoryBranches } from "@/api/repositories";
import { getRepositories } from "@/api/repositories";
import { useQuery } from "@tanstack/react-query";

export const gitKeys = {
	all: ["git"] as const,
	commits: () => [...gitKeys.all, "commits"] as const,
	repositories: () => [...gitKeys.all, "repositories"] as const,
	repository: (id: string) => [...gitKeys.all, "repository", id] as const,
	repositoryBranches: (id: string) => [...gitKeys.all, "repository", id, "branches"] as const,
};

export const useGitCommits = () => {
	return useQuery({ queryKey: gitKeys.commits(), queryFn: getCommits });
};

export const useGitRepositories = () => {
	return useQuery({ queryKey: gitKeys.repositories(), queryFn: getRepositories });
};

export const useGitRepository = (id: string) => {
	return useQuery({ queryKey: gitKeys.repository(id), queryFn: () => getRepository(id) });
};

export const useGitRepositoryBranches = (id: string) => {
	return useQuery({ queryKey: gitKeys.repositoryBranches(id), queryFn: () => getRepositoryBranches(id) });
};
