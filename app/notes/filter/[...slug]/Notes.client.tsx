"use client";

import css from "@/app/notes/Notes.module.css";
import { useState } from "react";
import { fetchNotes } from "@/lib/api";
import {
  QueryClient,
  QueryClientProvider,
  HydrationBoundary,
  useQuery,
  DehydratedState,
} from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import SearchBox from "@/components/SearchBox/SearchBox";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import useModalControl from "@/hooks/useModalControl";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import Loader from "@/components/Loader/Loader";
import ErrorHandler from "../../error";
import type { Note } from "@/types/note";

interface NotesClientProps {
  filterTag?: string;
  dehydratedState?: DehydratedState;
}

interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

const NotesClient = ({ filterTag, dehydratedState }: NotesClientProps) => {
  const { isModalOpen, openModal, closeModal } = useModalControl();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  //   створення QueryClient
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}>
        <NotesContent
          filterTag={filterTag}
          search={search}
          page={page}
          setSearch={setSearch}
          setPage={setPage}
          isModalOpen={isModalOpen}
          openModal={openModal}
          closeModal={closeModal}
        />
      </HydrationBoundary>
    </QueryClientProvider>
  );
};

interface NotesContentProps {
  filterTag?: string;
  search: string;
  page: number;
  setSearch: (value: string) => void;
  setPage: (page: number) => void;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const NotesContent = ({
  filterTag,
  search,
  page,
  setSearch,
  setPage,
  isModalOpen,
  openModal,
  closeModal,
}: NotesContentProps) => {
  const { data, isFetching, isLoading, error, refetch } = useQuery<
    NotesResponse,
    Error
  >({
    queryKey: ["notes", search, page, filterTag],
    queryFn: () =>
      fetchNotes(page, search, filterTag === "all" ? undefined : filterTag),
    staleTime: 10000,
  });

  const debounceSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 300);

  if (error)
    return <ErrorHandler error={error as Error} reset={() => refetch()} />;

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <div className={css.app}>
      <div className={css.toolbar}>
        <SearchBox
          search={search}
          onChange={(e) => debounceSearch(e.target.value)}
        />

        {totalPages > 1 && (
          <Pagination page={page} totalPages={totalPages} setPage={setPage} />
        )}

        <button onClick={openModal} className={css.button}>
          Create note +
        </button>
      </div>

      {isFetching && <Loader />}

      {!isLoading && notes.length === 0 ? (
        <p>No notes found for your search ☹️</p>
      ) : (
        <NoteList notes={notes} />
      )}

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onClose={closeModal} onSuccess={closeModal} />
        </Modal>
      )}
    </div>
  );
};

export default NotesClient;
