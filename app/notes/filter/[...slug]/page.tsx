import NotesClient from "./Notes.client";
import { fetchNotes } from "@/lib/api";
import { QueryClient, dehydrate } from "@tanstack/react-query";

interface FilteredNotesPageProps {
  params: Promise<{ slug?: string[] }>;
}

export default async function FilteredNotesPage({
  params,
}: FilteredNotesPageProps) {
  const { slug } = await params;
  const tag = Array.isArray(slug) ? slug[0] : slug || "all";

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["notes", "", 1, tag],
    queryFn: () => fetchNotes(1, "", tag),
  });

  return (
    <NotesClient filterTag={tag} dehydratedState={dehydrate(queryClient)} />
  );
}
