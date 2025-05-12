import {Room} from "@/components/room/room";
import {Suspense} from "react";
import {Loading} from "./skeleton";


export default async function Page() {
    return (
        <>
            <Suspense fallback={<Loading/>}>
                <Room/>
            </Suspense>
        </>
    );
}
