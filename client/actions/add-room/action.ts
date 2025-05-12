"use server";
import {AddRoomSchema, Field, FormState} from "@/actions/add-room/types";
import {getSession} from "@/features/session/server";
import {revalidateTag} from "next/cache";
import {httpClient} from "@/features/http-client";
import {Room} from "@/types/room";

export async function addRoomAction(_: FormState, formData: FormData) {
    const validatedFields = AddRoomSchema.safeParse({
        name: formData.get(Field.Name),
    });

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const session = await getSession();

    const {data, error} = await httpClient<Room>("/api/rooms", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.accessToken}`,
        },

        body: JSON.stringify({
            name: validatedFields.data.name,
        }),
    });


    if (error) {
        return {
            success: false,
            message: error,
        };
    }

    revalidateTag("rooms");

    return {
        success: true,
        data,
    };
}
