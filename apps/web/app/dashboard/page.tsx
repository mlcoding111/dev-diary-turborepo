import { verifySession } from "@/lib/session";
import { getMe } from "../actions/user";

export default async function Dashboard(){
    const session = await verifySession();
    // const { data: user } = await getMe();
    
    // const role = session?.role;
    // if(role === "admin"){
    //     return (
    //         <div>
    //             <h1>Dashboard</h1>
    //             <p>{user?.email}</p>
    //         </div>
    //     )
    // }

    // return <UserDashboard />

    return (
        <div>
            <h1>Dashboard</h1>
            {/* <p>{user?.email}</p> */}
        </div>
    )
}

function UserDashboard(){
    return (
        <div>
            <h1>User Dashboard</h1>
        </div>
    )
}

function AdminDashboard(){
    return (
        <div>
            <h1>Admin Dashboard</h1>
        </div>
    )
}