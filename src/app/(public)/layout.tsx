import { PublicChrome } from "@/components/layout/public-chrome";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <PublicChrome>{children}</PublicChrome>;
}
