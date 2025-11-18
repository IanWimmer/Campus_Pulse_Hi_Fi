'use client'



import Card from "@/components/card/Card";
import ProgressionBar from "@/components/ProgressionBar";
import { useOnboardingContext } from "@/contexts/OnboardingContext";
import { useRouter } from "next/navigation";
import React, { useState } from "react";



const CardArrangement = ({
  title1,
  title2,
  description1,
  description2,
  imageSrc1,
  imageSrc2,
}: {
  title1: string,
  title2: string,
  description1: string,
  description2: string,
  imageSrc1: string,
  imageSrc2: string,
}) => {
  return <div>
    <div className="text-2xl font-semibold text-center h-24">
      Which one would you rather choose?
    </div>
    <div className="relative">
      <div className="bg-neutral-200 px-4 py-8">
        <Card 
          imageSrc="images/party.jpg"
          title={"Party @ John’s, wird epic!!! 🔥🔥"} 
          description={"Komm vorbei zur Houseparty des Jahrhunderts! Jeder, der etwas Alk mitbringt, ist herzlich ..."}
        />
      </div>
      <span className="absolute top-[calc(50%-24px)] left-[calc(50%-24px)] h-12 w-12 bg-white flex justify-center items-center rounded-full font-semibold text-lg">
        OR
      </span>
      <div className="bg-neutral-300 px-4 py-8">
        <Card 
          imageSrc="images/boardgame.jpg"
          title={"Gemütlicher Brettspielabend"}
          description={"Wir spielen Catan, Dominion, The 7th continent und weitere Strategiespiele. Wir suchen Mitspieler ..."}
        />
      </div>
    </div>
  </div>
}


const OnboardingPage = () => {
  const onboardingContext = useOnboardingContext()
  const router = useRouter()

  let output = <></>

  if (onboardingContext.state.done) {
    router.replace('/')
  }

  if (onboardingContext.state.stage == 0) {
    output = <div className="w-full h-full" onClick={() => onboardingContext.actions(1)}>
      <h1 className="text-5xl/tight font-semibold text-center relative w-full top-1/8">
        Welcome to 
        <br/> 
        <span className="text-primary">Campus Pulse</span>, 
        <br/> 
        Name👋
      </h1>
      <h2 className="text-[32px] font-semibold text-center relative w-full top-2/6">
        Let's get to know
        <br/> 
        you a bit.
      </h2>
    </div>
  }


  if (onboardingContext.state.stage == 1) {
    output = <div>
      <CardArrangement 
        imageSrc1="images/party.jpg"
        title1="Party @ John’s, wird epic!!! 🔥🔥"
        description1="Komm vorbei zur Houseparty des Jahrhunderts! Jeder, der etwas Alk mitbringt, ist herzlich ..."
        imageSrc2="images/boardgame.jpg"
        title2="Gemütlicher Brettspielabend"
        description2="Wir spielen Catan, Dominion, The 7th continent und weitere Strategiespiele. Wir suchen Mitspieler ..."
      />
    </div>
  }


  return <main className="container">
    <div className="absolute top-16 w-full h-fit flex justify-center p-2">
      <ProgressionBar current_stage={onboardingContext.state.stage} n_stages={onboardingContext.state.max_stages} />
    </div>

    <div className="absolute top-28 w-full h-[calc(100%-128px)]">
      {output}
    </div>
    
    
  </main>;
};

export default OnboardingPage;
