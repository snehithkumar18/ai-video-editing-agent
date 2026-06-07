import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Timeline Editor | VidAgent',
};

export default function EditorLayoutOverride({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-[#0A0A0A] overflow-hidden flex flex-col">
      {children}
    </div>
  );
}
