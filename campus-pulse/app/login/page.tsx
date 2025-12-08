"use client";

import { useLoginContext } from "@/contexts/LoginContext";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboardingContext } from "@/contexts/OnboardingContext";

const LoginPage = () => {
  const loginContext = useLoginContext();
  const onboradingContext = useOnboardingContext();
  const router = useRouter();

  const switchToLogin = () => {
    if (!loginContext.state.state) {
      loginContext.actions(true);
    }
  };

  /*
  useEffect(() => {
    if (loginContext.state.state) {
      if (onboradingContext.state.done) {
        router.replace("/");
      } else {
        router.replace("/onboarding");
      }
    }
  }, [loginContext.state.state]);
  */

  return (
    <main className="h-[calc(var(--vh,1vh)*100)] w-full bg-white">
      <div className="h-[calc(100%-72px)] absolute flex items-center justify-center pr-4">
        <img src={"/icons/raw/campus_pulse_logo.svg"} alt="Logo" />
      </div>
      <div className="fixed bottom-0 left-0 w-full h-fit pb-6 px-2">
        <PrimaryButton
          onClick={() => switchToLogin()}
          text={"SWITCHaai Login"}
          containerClassName="w-full text-xl"
        />
      </div>
    </main>
  );
};

export default LoginPage;
