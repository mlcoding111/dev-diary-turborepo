import { api } from "@/lib/api";

export enum OAuthProviderType {
	GOOGLE = "google",
	GITHUB = "github",
	BITBUCKET = "bitbucket",
	GITLAB = "gitlab",
	AZURE = "azure",
}

/**
 * Get the integrations
 * @returns {Promise<any>} - The integrations
 */
export async function getIntegrations() {
	try {
		const res = await api.get("/integrations");
		if (res.status !== 200) return null;

		return res.data;
	} catch (e) {
		console.log("Error", e);
		return e;
	}
}

/**
 * Get the integration by id
 * @param {string} id - The id of the integration
 * @returns {Promise<any>} - The integration
 */
export async function getIntegration(id: string) {
	try {
		const res = await api.get(`/integrations/${id}`);
		if (res.status !== 200) return null;

		return res.data;
	} catch (e) {
		console.log("Error", e);
		return e;
	}
}

/**
 * Get the available integrations
 * @returns {Promise<any>} - The available integrations
 */
export async function getIntegrationsList() {
	try {
		const res = await api.get("/integrations/available");
		if (res.status !== 200) return null;

		return res.data;
	} catch (e) {
		console.log("Error", e);
		return e;
	}
}

/**
 * Get the formatted integrations
 * @returns {Promise<any>} - The formatted integrations
 */
export async function getFormattedIntegrations() {
	try {
		const res = await api.get("/integrations/formatted");
		if (res.status !== 200) return null;

		return res.data;
	} catch (e) {
		console.log("Error", e);
		return e;
	}
}

/**
 * Connect to an integration
 * @param {string} providerId - The provider id of the integration
 * @returns {Promise<any>} - The integration
 */
export async function connectToIntegration(providerId: string) {
	try {
		const res = await api.post(`/integrations/connect/${providerId}`);
		if (res.status !== 200) return null;

		return res.data;
	} catch (e) {
		console.log("Error", e);
		return e;
	}
}

/**
 * Disconnect from an integration
 * @param {string} providerId - The provider id of the integration
 * @returns {Promise<any>} - The integration
 */
export async function disconnectFromIntegration(providerId: string) {
	try {
		const res = await api.post(`/integrations/disconnect/${providerId}`);
		if (res.status !== 200) return null;

		return res.data;
	} catch (e) {
		console.log("Error", e);
		return e;
	}
}

/**
 * Delete an integration
 * @param {string} providerId - The provider id of the integration
 * @returns {Promise<any>} - The integration
 */
export async function deleteIntegration(providerId: string) {
	try {
		const res = await api.delete(`/integrations/${providerId}`);

		if (res.status !== 200) return null;

		return res.data;
	} catch (e) {
		console.log("Error", e);
		return e;
	}
}
