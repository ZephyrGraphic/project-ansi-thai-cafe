import { getUsers } from "@/lib/actions/users";
import UsersPageClient from "./UsersPageClient";

export default async function UsersPage() {
  const users = await getUsers();

  return <UsersPageClient users={users} />;
}
