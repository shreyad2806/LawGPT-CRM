import { supabase } from "@/lib/supabase";

export async function getContentQueue() {
  const { data, error } = await supabase
    .from("content_queue")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}