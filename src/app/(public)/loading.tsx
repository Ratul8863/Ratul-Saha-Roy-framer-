import { Skeleton } from "@/components/ui/skeleton";
import { SectionContainer } from "@/components/layout/section-container";

export default function PublicLoading() {
  return (
    <SectionContainer className="space-y-6 py-16">
      <Skeleton className="h-10 w-48" />
      <Skeleton className="h-24 w-full max-w-3xl" />
      <Skeleton className="h-64 w-full" />
    </SectionContainer>
  );
}
