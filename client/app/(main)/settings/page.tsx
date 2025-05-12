import { logout } from "@/actions/logout";
import { Button } from "@/components/ui/button";

export default function Setting() {
  return (
    <div>
      Settings
      <form action={logout}>
        <Button type="submit">Log out</Button>
      </form>
    </div>
  );
}
