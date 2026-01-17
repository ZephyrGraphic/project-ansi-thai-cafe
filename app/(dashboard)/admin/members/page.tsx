import { getMembers } from "@/lib/actions/members";
import MembersPageClient from "./MembersPageClient";

export default async function MembersPage() {
  const members = await getMembers();

  return <MembersPageClient members={members} />;
}
