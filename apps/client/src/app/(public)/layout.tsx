

export const metadata = {
  robots: {
    index: true,
    follow: true,
  },
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
    </>
  );
}
