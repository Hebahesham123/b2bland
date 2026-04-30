import { getServerSupabase } from "@/lib/supabase";
import LandingPage from "@/components/LandingPage";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = getServerSupabase();
  let campaign = null;
  if (supabase) {
    const { data } = await supabase
      .from("campaigns")
      .select("*")
      .eq("active", true)
      .order("id", { ascending: true })
      .limit(1)
      .maybeSingle();
    campaign = data;
  }
  return <LandingPage campaign={campaign} />;
}
