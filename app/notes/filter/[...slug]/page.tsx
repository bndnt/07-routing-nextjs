"use client";

import NotesClient from "./Notes.client";
import { useParams } from "next/navigation";

export default function FilteredNotesPage() {
  const params = useParams();
  const slug = params.slug; //  папка [..slug]
  const tag = Array.isArray(slug) ? slug[0] : slug || "all";

  return <NotesClient filterTag={tag} />;
}
