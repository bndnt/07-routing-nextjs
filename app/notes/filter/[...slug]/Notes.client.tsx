"use client";
import css from "@/app/notes/Notes.module.css";
import { useState } from "react";
import { fetchNotes, fetchNotesByTag } from "@/lib/api";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import SearchBox from "@/components/SearchBox/SearchBox";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import useModalControl from "@/hooks/useModalControl";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import Loader from "@/components/Loader/Loader";
import ErrorHandler from "../../error";
interface NotesClientProps {
  filterTag?: string;
}
const NotesClient = ({ filterTag }: NotesClientProps) => {
  const { isModalOpen, openModal, closeModal } = useModalControl();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isFetching, isLoading, error, refetch } = useQuery({
    queryKey: ["notes", search, page, filterTag],
    queryFn: async () => {
      return fetchNotesByTag(filterTag || "all", page, search);
    },
    placeholderData: keepPreviousData,
    staleTime: 10,
  });

  const debounceSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 30);

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
