import { auth, clerkClient } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function AdminPage() {
    const { userId } = auth();

    if (!userId) {
        redirect("/sign-in");
    }

    const user = await clerkClient.users.getUser(userId);
    const isAdmin = user.publicMetadata.role === "admin";

    if (!isAdmin) {
        return <div>Access Denied. Admin only.</div>;
    }

    return <div>Welcome to the Admin Dashboard</div>;
}