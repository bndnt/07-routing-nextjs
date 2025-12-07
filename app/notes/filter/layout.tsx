import css from "../Notes.module.css";

interface NotesFilterLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
}

export default function NotesFilterLayout({
  children,
  sidebar,
}: NotesFilterLayoutProps) {
  return (
    <div className={css.layout}>
      <aside className={css.sidebar}>{sidebar}</aside>
      <main className={css.main}>{children}</main>
    </div>
  );
}
