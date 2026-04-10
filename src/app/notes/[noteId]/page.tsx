import { NoteEditor } from "@/components/note-editor";

type NotePageProps = {
  params: Promise<{
    noteId: string;
  }>;
};

export default async function NotePage({ params }: NotePageProps) {
  const { noteId } = await params;

  return <NoteEditor noteId={noteId} />;
}
