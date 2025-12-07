import Modal from "@/components/Modal/Modal";
import NotePreviewClient from "./NotePreview.client";
import { fetchNoteById } from "@/lib/api";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { HydrationBoundary } from "@tanstack/react-query";

interface NotePreviewPageProps {
  params: { id: string } | Promise<{ id: string }>;
}

export default async function NotePreviewPage({
  params,
}: NotePreviewPageProps) {
  const { id } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <Modal>
      <HydrationBoundary state={dehydratedState}>
        <NotePreviewClient noteId={id} />
      </HydrationBoundary>
    </Modal>
  );
}
