import { notFound } from "next/navigation";
import { getServerSupabase } from "@/lib/supabase";
import LandingPage from "@/components/LandingPage";

export const dynamic = "force-dynamic";

type Props = { params: { id: string } };

export default async function CampaignPage({ params }: Props) {
  const { id } = params;
  if (!/^\d+$/.test(id)) notFound();
  const supabase = getServerSupabase();
  if (!supabase) notFound();
  const { data } = await supabase
    .from("campaigns")
    .select("*")
    .eq("id", Number(id))
    .maybeSingle();
  if (!data || data.active === false) notFound();
  return <LandingPage campaign={data} />;
}
