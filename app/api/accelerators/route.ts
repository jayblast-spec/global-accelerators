import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() ?? "";
  const region = searchParams.get("region") ?? "";
  const stage = searchParams.get("stage") ?? "";
  const focus = searchParams.get("focus") ?? "";
  const verified = searchParams.get("verified") === "true";
  const activeOnly = searchParams.get("active") !== "false";
  const page = Math.max(0, parseInt(searchParams.get("page") ?? "0"));
  const limit = Math.min(48, parseInt(searchParams.get("limit") ?? "24"));

  let query = supabase
    .from("accelerators")
    .select("*", { count: "exact" })
    .order("diligence_score", { ascending: false })
    .order("name", { ascending: true })
    .range(page * limit, (page + 1) * limit - 1);

  if (q) {
    query = query.or(
      `name.ilike.%${q}%,tagline.ilike.%${q}%,description.ilike.%${q}%,country.ilike.%${q}%,city.ilike.%${q}%`
    );
  }
  if (region) query = query.eq("region", region);
  if (stage) query = query.contains("stages", [stage]);
  if (focus) query = query.contains("focus_areas", [focus]);
  if (verified) query = query.eq("is_verified", true);
  if (activeOnly) query = query.eq("is_active", true);

  const { data, error, count } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data: data ?? [], total: count ?? 0, page });
}
