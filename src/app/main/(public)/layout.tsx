import { Header } from "@/components/marketing-blocks/header";
import { Footer } from "@/components/blocks/footers/footer1";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
  <>
  
  <Header />
  {children}
  <Footer />
  
  </>

  );
}
