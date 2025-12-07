import Modal from "@/components/Modal/Modal";
import NotePreviewClient from "./NotePreview.client";
import { fetchNoteById } from "@/lib/api";
import { QueryClient, dehydrate } from "@tanstack/react-query";

interface NotePreviewPageProps {
  params: { id: string } | Promise<{ id: string }>; // допустимо Promise
}

export default async function NotePreviewPage({
  params,
}: NotePreviewPageProps) {
  // Розпаковуємо Promise, якщо params — проміс
  const { id } = await params;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <Modal>
      <NotePreviewClient noteId={id} dehydratedState={dehydrate(queryClient)} />
    </Modal>
  );
}
