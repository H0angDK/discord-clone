"use client"
import {Input} from "@/components/ui/input";
import {SearchIcon} from "@/components/icon";
import {usePathname, useRouter, useSearchParams} from "next/navigation";


function Header() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const {replace, refresh} = useRouter();

    const handleSearch = (query: string) => {
        const params = new URLSearchParams(searchParams);
        if (query) {
            params.set('query', query);
        } else {
            params.delete('query');
        }
        replace(`${pathname}?${params.toString()}`);
        refresh();
    };
    return (
        <>
            <Input
                type="text"
                variant="primary"
                inputClassName="py-1!"
                icon={<SearchIcon className="size-6"/>}
                placeholder={"Search"}
                onChange={(e) => {
                    handleSearch(e.target.value);
                }}
                defaultValue={searchParams.get('query')?.toString()}
            />

        </>
    );
}

export default Header;
