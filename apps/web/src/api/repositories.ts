import { api } from "@/lib/api";

export async function getRepositories() {
	try {
		const res = await api.get("git/repositories");
		if (res.status !== 200) return null;

		return res.data;
	} catch (e) {
		console.log("Error", e);
		return e;
	}
}

export async function getRepository(id: string) {
	try {
		const res = await api.get(`git/repositories/${id}`);
		if (res.status !== 200) return null;

		return res.data;
	} catch (e) {
		console.log("Error", e);
		return e;
	}
}

export async function getRepositoryBranches(id: string) {
	try {
		const res = await api.get(`git/repositories/${id}/branches`);
		if (res.status !== 200) return null;

		return res.data;
	} catch (e) {
		console.log("Error", e);
		return e;
	}
}
