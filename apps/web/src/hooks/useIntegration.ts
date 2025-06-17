import { getFormattedIntegrations, getIntegrationsList, getIntegration, disconnectFromIntegration, connectToIntegration, deleteIntegration } from "@/api/integration";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const integrationKeys = {
	all: ["integration"] as const,
	formatted: () => [...integrationKeys.all, "formatted"] as const,
	list: () => [...integrationKeys.all, "list"] as const,
	item: (id: string) => [...integrationKeys.all, "item", id] as const,
};

export const useFormattedIntegrations = () => {
	return useQuery({ queryKey: integrationKeys.formatted(), queryFn: getFormattedIntegrations });
};

export const useIntegrationList = () => {
	return useQuery({ queryKey: integrationKeys.list(), queryFn: getIntegrationsList });
};

export const useIntegration = (id: string) => {
	return useQuery({ queryKey: integrationKeys.item(id), queryFn: () => getIntegration(id) });
};

export const useConnectToIntegration = () => {
	const queryClient = useQueryClient();

	return useMutation({ mutationFn: (providerId: string) => connectToIntegration(providerId), onSuccess: () => {
		queryClient.invalidateQueries();
	} });
};

export const useDisconnectFromIntegration = () => {
	const queryClient = useQueryClient();

	return useMutation({ mutationFn: (providerId: string) => disconnectFromIntegration(providerId), onSuccess: () => {
		queryClient.invalidateQueries();
	} });
};


export const useDeleteIntegration = () => {
	const queryClient = useQueryClient();

	return useMutation({ mutationFn: (providerId: string) => deleteIntegration(providerId), onSuccess: () => {
		queryClient.invalidateQueries();
	} });
};


