import {NextRequest, NextResponse} from "next/server";
import {deleteSession, getSession, setSession} from "@/features/session/server";

export async function GET() {
    try {
        const session = await getSession();
        return NextResponse.json(session);
    } catch (error) {
        return NextResponse.json(
            {error: `Failed to get session: ${error}`},
            {status: 500}
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        await setSession(data);
        return NextResponse.json({success: true});
    } catch (error) {
        return NextResponse.json(
            {error: `Failed to set session: ${error}`},
            {status: 500}
        );
    }
}

export async function DELETE() {
    try {
        await deleteSession();
        return NextResponse.json({success: true});
    } catch (error) {
        return NextResponse.json(
            {error: `Failed to delete session: ${error}`},
            {status: 500}
        );
    }
}
