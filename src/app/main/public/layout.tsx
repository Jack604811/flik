import MarketingHeader from "@/components/marketing-blocks/header";
import { Footer } from "@/components/marketing-blocks/footer";
import MainContent from "@/components/main-content";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
  <>
  
  <MainContent>
    <MarketingHeader />
      {children}
    <Footer />
  </MainContent>
  
  </>

  );
}
