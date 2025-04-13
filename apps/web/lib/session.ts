import 'server-only';
import { JWTPayload, SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const key = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET);

const cookie = {
    name: "session",
    options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        // maxAge: 60 * 60 * 24 * 30,
        path: "/",
    },
    duration: 24 * 60 * 60 * 1000,
}
export async function encrypt(payload: JWTPayload){
    return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime('1day')
    .sign(key);
}

export async function decrypt(session: string){
    try{
        const { payload } = await jwtVerify(session, key, {
            algorithms: ["HS256"],
        });
        return payload;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function createSession(userId: string){
    const expires = new Date(Date.now() + cookie.duration);
    const session = await encrypt({ userId, expires});
    
    (await cookies()).set(cookie.name, session, cookie.options);
    redirect("/dashboard")
}

export async function verifySession(){
    const cookie = (await cookies()).get(cookies.name)?.value;
    const session = await decrypt(cookie);
    if(!session?.userId) {
        redirect("/login");
    }
    return { userId: session.userId };
}

export async function deleteSession(){
    cookies().delete(cookie.name);

    redirect("/login");
}