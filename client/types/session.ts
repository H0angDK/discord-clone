export interface SessionData extends UserData {
    accessToken: string;
    refreshToken: string;
    expiredIn: number
}

export type UserData = {
    userId: string;
    username: string;
};