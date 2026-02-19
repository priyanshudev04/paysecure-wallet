"use client";

import { Suspense } from "react";
import SendPage from "./SendPage";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SendPage />
    </Suspense>
  );
}
