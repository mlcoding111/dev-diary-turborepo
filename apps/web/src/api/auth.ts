import { api } from "@/lib/api";

export async function fetchMe() {
	try {
		const res = await api.get("/users/me");
		if (res.status !== 200) return null;

		return res.data;
	} catch (e) {
		console.log("Error", e);
		return e;
	}
}

export async function login(email: string, password: string) {
	const response = await api.post("/auth/login", { email, password });

	if (response.status !== 200) return null;

	return response.data;
}

export async function logout() {
	const response = await api.post("/auth/logout");

	return response.data;
}
