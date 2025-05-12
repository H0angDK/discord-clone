import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BurgerIcon, SearchIcon } from "@/components/icon";

interface HeaderProps {
  isSidebarOpen: boolean;
  onToggle: () => void;
}

function Header({ isSidebarOpen, onToggle }: HeaderProps) {
  return (
    <>
      {isSidebarOpen && (
        <Input
          type="text"
          variant="primary"
          inputClassName="py-1!"
          icon={<SearchIcon className="size-6" />}
          placeholder={"Search"}
        />
      )}

      <Button variant="outline" size="sm" className="p-1!" onClick={onToggle}>
        <BurgerIcon className="fill-text-primary size-6" />
      </Button>
    </>
  );
}

export default Header;
