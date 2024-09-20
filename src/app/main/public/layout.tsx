import MarketingHeader from "@/components/marketing-blocks/header";
import { Footer } from "@/components/marketing-blocks/footer";


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
