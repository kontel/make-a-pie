"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocalStorage } from "usehooks-ts";
import type { PieWithVotes } from "@/types/prisma";
import { SubmitPieForm } from "@/components/submit-pie-form";
import { SubmittedPieView } from "@/components/submitted-pie-view";

interface SubmitPieClientProps {
  initialPies: PieWithVotes[];
}

export function SubmitPieClient({ initialPies }: SubmitPieClientProps) {
  const [userName] = useLocalStorage("userName", "", {
    initializeWithValue: true,
  });
  const router = useRouter();

  useEffect(() => {
    if (!userName) {
      router.push("/");
    }
  }, [router, userName]);

  if (!userName) {
    return null;
  }

  const userPie = initialPies?.find(
    (pie) => pie.userName.replaceAll('"', "") === userName.replaceAll('"', "")
  );

  if (userPie) {
    return <SubmittedPieView userPie={userPie} />;
  }

  return <SubmitPieForm userName={userName} />;
}
