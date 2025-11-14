"use client"



import { useLoginContext } from "@/contexts/LoginContext";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const loginContext = useLoginContext()
  const router = useRouter()

  const switchToLogin = () => {
    if (!loginContext.state) {loginContext.actions(true)}
  }


  useEffect(() => {
    if (loginContext.state) {
      router.replace('/')
    }
  }, [loginContext.state])


  return <main className="page-container h-screen w-full bg-white flex items-center justify-center">
    <h1 className="text-primary text-5xl/tight font-medium text-center">
      Campus <br/> Pulse
    </h1>
    
    <PrimaryButton onClick={() => switchToLogin()} text={"SWITCHaai Login"} containerClassName="absolute bottom-0 left-0 w-[calc(100%-16px)] mx-2 mb-4 h-12 text-xl"/>
  </main>;
};

export default LoginPage;
