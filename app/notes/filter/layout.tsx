import SidebarNotes from "./@sidebar/default";
import css from "../Notes.module.css";

export default function NotesFilterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={css.layout}>
      <aside className={css.sidebar}>
        <SidebarNotes />
      </aside>
      <main className={css.main}>{children}</main>
    </div>
  );
}
