import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
