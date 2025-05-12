import { Room } from "@/types/room";
import { z } from "zod";

export const AddRoomSchema = z.object({
  name: z.string().nonempty({ message: "Name is required." }).trim(),
});

export type FormState =
  | {
      errors?: {
        name?: string[];
      };
      message?: string;
      success: boolean;
      data?: Room;
    }
  | undefined;

export enum Field {
  Name = "name",
}
