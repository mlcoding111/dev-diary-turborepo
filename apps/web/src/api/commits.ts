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