"use server";
import {AddRoomSchema, Field, FormState} from "@/actions/add-room/types";
import {revalidateTag} from "next/cache";
import {roomsAPI} from "@/features/api";

export async function addRoomAction(_: FormState, formData: FormData) {
    const validatedFields = AddRoomSchema.safeParse({
        name: formData.get(Field.Name),
        isPrivate: formData.get(Field.IsPrivate) === "on",
    });

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const {data, error} = await roomsAPI.createRoom(validatedFields.data.name, validatedFields.data.isPrivate);

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
