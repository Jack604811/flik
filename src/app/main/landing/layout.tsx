import MarketingHeader from "@/components/marketing/header";
import { Footer } from "@/components/blocks/footers/footer1";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
  <>
  
  <MarketingHeader />
  {children}
  <Footer />
  
  </>

  );
}
