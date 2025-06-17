import { api } from "@/lib/api";

export async function getCommits() {
	try {
		const res = await api.get("/git/commits");
		if (res.status !== 200) return null;

		return res.data;
	} catch (e) {
		console.log("Error", e);
		return e;
	}
}

export async function getRepositories() {
	try {
		const res = await api.get("/git/repositories");
		if (res.status !== 200) return null;

		return res.data;
	} catch (e) {
		console.log("Error", e);
		return e;
	}
}

export async function getBranches() {
	try {
		const res = await api.get("/git/branches");
		if (res.status !== 200) return null;

		return res.data;
	} catch (e) {
		console.log("Error", e);
		return e;
	}
}
