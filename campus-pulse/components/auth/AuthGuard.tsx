"use client";

import { useLoginContext } from "@/contexts/LoginContext";
import { useOnboardingContext } from "@/contexts/OnboardingContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingPageOverlay from "../loading_page_overlay/LoadingPageOverlay";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const loggedIn = useLoginContext().state.state;
  const onboardingContext = useOnboardingContext();
  const onboardingDone = onboardingContext.state.done;
  const [prevPath, setPrevPath] = useState<string | null>(null);

  useEffect(() => {
    // skip if we're looking at the components page
    // console.log("onboardingDone:", onboardingDone)
    if (pathname === "/components") {
      console.log(pathname);
    }
    // make sure to only redirect if loggedIn is not null. If it is, the server is still loading, which means, we can't tell what will happen.
    else if (loggedIn !== null) {
      // if not loggedIn, we redirect to the login page and save the previous path to prevPath
      if (!loggedIn) {
        if (pathname !== "/login") setPrevPath(pathname);
        router.replace("/login");
      }
      // if onboading isn't done yet, we redirect to the onboarding page (if we're currently not on the login page)
      else if (!onboardingDone && pathname !== "/onboarding") {
        router.replace("/onboarding");
      } else if (
        loggedIn &&
        (pathname === "/login" || pathname === "/onboarding") &&
        onboardingDone
      ) {
        router.replace(prevPath === null ? "/" : prevPath);
      }
    }
  }, [loggedIn, pathname, onboardingDone]);

  /*
  useEffect(() => {
    console.log("prevPath:", prevPath);
  }, [prevPath]);
  */

  if (
    loggedIn === null ||
    (!loggedIn && pathname !== "/login" && pathname !== "/onboarding") ||
    (loggedIn && pathname === "/login")
  ) {
    return <LoadingPageOverlay />;
  }
  return children;
}
