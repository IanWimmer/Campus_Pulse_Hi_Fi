"use client";

import Card from "@/components/card/Card";
import OnboardingProgressionBar from "@/components/OnboardingProgressionBar";
import { useOnboardingContext } from "@/contexts/OnboardingContext";
import AddFriends from "@/page_components/add_friends/AddFriends";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const CardArrangement = ({
  title1,
  title2,
  description1,
  description2,
  imageSrc1,
  imageSrc2,
  onClick,
  selection,
}: {
  title1: string;
  title2: string;
  description1: string;
  description2: string;
  imageSrc1: string;
  imageSrc2: string;
  onClick: (option: number) => void;
  selection: number;
}) => {
  return (
    <div className="h-[calc(100%-60px)]">
      <div className="text-2xl font-semibold text-center h-22">
        Which one would you
        <br />
        rather choose?
      </div>
      <div className="relative h-[calc(100%-88px)]">
        <div
          className="px-4 pt-8 pb-9 h-1/2"
          onClick={() => onClick(1)}
          style={{
            backgroundImage:
              selection == 1
                ? 'url("/background_patterns/background_pattern_dotted_green.svg")'
                : 'url("/background_patterns/background_pattern_dotted.svg")',
            backgroundRepeat: "repeat",
            backgroundSize: '300px auto',
            backgroundPositionX: 'center'
          }}
        >
          <Card
            imageSrc={imageSrc1}
            title={title1}
            description={description1}
            height={"h-[100%]"}
          />
        </div>
        <span className="absolute top-[calc(50%-24px)] left-[calc(50%-24px)] h-12 w-12 bg-white flex justify-center items-center rounded-full font-semibold text-lg border-2 border-black shadow-neobrutalist-sm">
          OR
        </span>
        <div
          className="bg-neutral-300 px-4 py-8  h-1/2"
          onClick={() => onClick(2)}
          style={{
            backgroundImage:
              selection == 2
                ? 'url("/background_patterns/background_pattern_striped_green.svg")'
                : 'url("/background_patterns/background_pattern_striped.svg")',
            backgroundRepeat: "repeat",
            backgroundSize: '300px auto',
            backgroundPositionX: 'center'
          }}
        >
          <Card
            imageSrc={imageSrc2}
            title={title2}
            description={description2}
            height={"h-[100%]"}
          />
        </div>
      </div>
    </div>
  );
};

const GoBackButton = ({ onboardingContext }: { onboardingContext: any; }) => {
  return <button
    className="h-10 flex items-center justify-center px-6 gap-2 font-secondary text-zinc-500"
    onClick={() => onboardingContext.actions.stage(onboardingContext.state.stage - 1)}
  >
    <ChevronLeft className="[&_path]:fill-zinc-400" /> Go back to
    previous
  </button>;
}

const SkipButton = ({ onboardingContext }: { onboardingContext: any; }) => {
  return <button
    className=" h-10 flex items-center justify-center px-6 gap-2 font-secondary text-zinc-500"
    onClick={() => onboardingContext.actions.stage(5)}
  >
    Skip for now <ChevronRight className="[&_path]:fill-zinc-400" />
  </button>;
}

const OnboardingPage = () => {
  const onboardingContext = useOnboardingContext();
  const router = useRouter();
  const time_first_stage = 5; // in seconds
  const time_last_stage = 7; // in seconds
  const time_per_page = [time_first_stage, -1, -1, -1, -1, time_last_stage];

  let output = <></>;

  useEffect(() => {
    if (onboardingContext.state.stage === 0) {
      const timer = setTimeout(() => {
        if (onboardingContext.state.stage === 0) {
          onboardingContext.actions.stage(1);
        }
      }, time_first_stage * 1000 + 500);

      return () => clearTimeout(timer);
    }

    if (onboardingContext.state.stage === 5) {
      const timer = setTimeout(() => {
        if (onboardingContext.state.stage === 5) {
          onboardingContext.actions.stage(6);
          router.replace("/");
        }
      }, time_last_stage * 1000 + 500);

      return () => clearTimeout(timer);
    }
    // If stage !== 0, do nothing and no timer is set
  }, [onboardingContext.state.stage]);

  if (onboardingContext.state.stage == 0) {
    output = (
      <div
        className="w-full h-full"
        onClick={() => onboardingContext.actions.stage(1)}
      >
        <h1 className="fixed top-[max(144px,20vh)] text-5xl/tight font-semibold text-center w-full">
          Welcome to
          <br />
          <span className="text-primary">Campus Pulse</span>,
          <br />
          Name👋
        </h1>
        <h2 className="fixed top-[max(384px,50vh)] text-2xl font-semibold text-center w-full">
          Let's get to know you a bit.
        </h2>

        <div className="fixed bottom-0 pl-2 pr-5 pb-8">
          <img src={"/icons/raw/campus_pulse_logo.svg"} alt="Logo" />
        </div>
      </div>
    );
  }

  if (onboardingContext.state.stage == 1) {
    output = (
      <>
        <CardArrangement
          title2="Gemütlicher Brettspielabend"
          title1="Party @ John's, wird epic!!! 🔥🔥"
          description1="Komm vorbei zur Houseparty des Jahrhunderts! Jeder, der etwas Alk mitbringt, ist herzlich ..."
          description2="Wir spielen Catan, Dominion, The 7th continent und weitere Strategiespiele. Wir suchen Mitspieler ..."
          imageSrc1="images/party.jpg"
          imageSrc2="images/boardgame.jpg"
          onClick={(option) => {
            onboardingContext.actions.selection(1, option);
            onboardingContext.actions.stage(2);
          }}
          selection={onboardingContext.state.selection[1]}
        />
        <div className="fixed bottom-0 left-0 w-full h-15 flex items-center justify-center bg-white border-t-2 border-t-black" />
      </>
    );
  }

  if (onboardingContext.state.stage == 2) {
    output = (
      <>
        <CardArrangement
          title1={"Spontane Yoga-Session"}
          title2={"Joggen an der Limmat"}
          description1={
            "3 Plätze frei im Gruppenraum @ ASVZ Relax. 30 Minuten Stretch & Chill!"
          }
          description2={
            "Treffpunkt Polybahn unten, gemütliches 5km/h-Tempo. Geplante Streck: 2km entlang der ..."
          }
          imageSrc1={"images/yoga.jpg"}
          imageSrc2={"images/jogging.jpg"}
          onClick={(option) => {
            onboardingContext.actions.selection(2, option);
            onboardingContext.actions.stage(3);
          }}
          selection={onboardingContext.state.selection[2]}
        />
        <div className="fixed bottom-0 left-0 w-full h-15 flex items-center justify-center bg-white">
          <GoBackButton onboardingContext={onboardingContext} />
        </div>
      </>
    );
  }

  if (onboardingContext.state.stage == 3) {
    output = (
      <>
        <CardArrangement
          title1={"Coding Jam 🧑‍💻"}
          title2={'Filmabend "Inception"'}
          description1={
            "Just messing around with AI agents, n8n and APIs. Open to everyone!"
          }
          description2={
            "Wohnheim 15, Paul-Feyerabend-Hof 3A. Wir haben Platz für 10 Personen, großer Beamer und Popcorn ..."
          }
          imageSrc1={"images/coding_jam.jpg"}
          imageSrc2={"images/movie_night.jpg"}
          onClick={(option) => {
            onboardingContext.actions.selection(3, option);
            onboardingContext.actions.stage(4);
          }}
          selection={onboardingContext.state.selection[3]}
        />
        <div className="fixed bottom-0 left-0 w-full h-15 flex items-center justify-center bg-white">
          <GoBackButton onboardingContext={onboardingContext} />
        </div>
      </>
    );
  }

  if (onboardingContext.state.stage == 4) {
    output = (
      <>
        <div className="text-center text-2xl font-semibold h-15">
          Add friends now!
        </div>
        <div className="w-full h-[calc(100%-120px)]">
          <AddFriends />
        </div>
        <div className="fixed bottom-0 left-0 w-full h-15 flex items-center justify-center bg-white">
          <GoBackButton onboardingContext={onboardingContext} />
          <SkipButton onboardingContext={onboardingContext}/>
        </div>
      </>
    );
  }

  if (onboardingContext.state.stage == 5) {
    output = (
      <div
        className="h-full w-full"
        onClick={() => {
          onboardingContext.actions.stage(6);
        }}
      >
        <h1 className="fixed top-[max(144px,30%)] text-5xl/tight font-semibold text-center w-full">
          Great, you're
          <br />
          all set! 😊
        </h1>
        <h2 className="fixed top-[max(384px,60%)] text-3xl font-semibold text-center w-full">
          Should you want to
          <br />
          change your
          <br />
          preferences, go to
          <br />
          the <span className="text-primary font-bold">Profile</span> section.
        </h2>
      </div>
    );
  }

  return (
    <main className="h-[calc(var(--vh,1vh)*100)]">
      <div className="fixed top-0 w-full h-fit flex justify-center p-2 pt-12">
        <OnboardingProgressionBar
          current_stage={onboardingContext.state.stage}
          n_stages={onboardingContext.state.max_stages}
          time_per_page={time_per_page}
        />
      </div>

      <div className="fixed top-24 w-full h-[calc(100%-96px)]">{output}</div>
    </main>
  );
};

export default OnboardingPage;
