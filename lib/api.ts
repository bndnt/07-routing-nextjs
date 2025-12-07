import axios from "axios";
import type { CreateNoteData, Note } from "@/types/note";
const BASE_URL = "https://notehub-public.goit.study/api/notes";
export interface FetchNotesResponse {
  page: number;
  notes: Note[];
  totalPages: number;
}

export async function fetchNotes(
  page: number = 1,
  search: string = "",
  tag: string = "all" // default "all"
): Promise<FetchNotesResponse> {
  const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

  const params: Record<string, any> = { page, search };
  if (tag.toLowerCase() !== "all") {
    params.tag = tag; //  tag if not "all"
  }

  const response = await axios.get<FetchNotesResponse>(BASE_URL, {
    params,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return {
    ...response.data,
    notes: response.data.notes || [],
  };
}
export const createNote = async (data: CreateNoteData) => {
  const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

  const response = await axios.post<Note>(BASE_URL, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
export const deleteNote = async (id: Note["id"]) => {
  const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

  const response = await axios.delete<Note>(
    `https://notehub-public.goit.study/api/notes/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
export async function fetchNoteById(noteId: Note["id"]) {
  const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

  const response = await axios.get<Note>(
    `https://notehub-public.goit.study/api/notes/${noteId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}

// export async function fetchNotesByTag(
//   tag: string,
//   page: number = 1,
//   search: string = ""
// ): Promise<FetchNotesResponse> {
//   const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;
//   const params: Record<string, any> = { page, search };

//   if (tag.toLowerCase() !== "all") {
//     params.tag = tag;
//   }

//   const response = await axios.get<FetchNotesResponse>(BASE_URL, {
//     params,
//     headers: { Authorization: `Bearer ${token}` },
//   });

//   return {
//     ...response.data,
//     notes: response.data.notes || [],
//   };
// }
