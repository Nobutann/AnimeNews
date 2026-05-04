import { startCron } from "@/lib/cron";

startCron();

export async function GET() {
    return Response.json({ ok: true });
}