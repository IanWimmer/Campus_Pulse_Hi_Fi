"use client";

import { LoginProvider } from "@/contexts/LoginContext";
import AuthGuard from "../components/auth/AuthGuard";
import { OnboardingProvider } from "@/contexts/OnboardingContext";
import { SearchVersionProvider } from "./SearchVersionContext";
import PopupRenderer from "@/utils/GlobalPopupManager";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <LoginProvider>
      <OnboardingProvider>
        <SearchVersionProvider>
          <AuthGuard>
            {children}
            <PopupRenderer />
          </AuthGuard>
        </SearchVersionProvider>
      </OnboardingProvider>
    </LoginProvider>
  );
};

export default Providers;
