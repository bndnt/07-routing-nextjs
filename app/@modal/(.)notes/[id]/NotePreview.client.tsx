"use client";

import { useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  HydrationBoundary,
  DehydratedState,
  useQuery,
} from "@tanstack/react-query";
import NotePreview from "@/components/NotePreview/NotePreview";
import { fetchNoteById } from "@/lib/api";

interface NotePreviewClientProps {
  noteId: string;
  dehydratedState: DehydratedState;
}

export default function NotePreviewClient({
  noteId,
  dehydratedState,
}: NotePreviewClientProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}>
        <NotePreviewHydrated noteId={noteId} />
      </HydrationBoundary>
    </QueryClientProvider>
  );
}

interface NotePreviewHydratedProps {
  noteId: string;
}

function NotePreviewHydrated({ noteId }: NotePreviewHydratedProps) {
  // Використовуємо useQuery для отримання даних на клієнті
  const {
    data: note,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["note", noteId],
    queryFn: () => fetchNoteById(noteId),
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError || !note) return <p>Note not found</p>;

  return <NotePreview note={note} onClose={() => window.history.back()} />;
}
