"use client";

import { useClickAnimation } from "@/utils/useClickAnimation";
import clsx from "clsx";
import { motion } from "motion/react";
import React from "react";
import QRCode from "../icons/QRCode";

const QRCodeButton = ({
  onClick = () => {
    false;
  },
  buttonClassName = "",
}: {
  onClick?: () => void;
  buttonClassName?: string;
}) => {
  const { clicked, handleClick } = useClickAnimation(onClick, { delay: 300 });

  return (
    <motion.button
      onClick={handleClick}
      className={clsx(
        "w-8 h-8 rounded-full border-2 flex items-center justify-center border-grayed [&_path]:fill-grayed shadow-grayed! text-xl font-semibold transition p-1.5",
        buttonClassName,
        clicked
          ? "shadow-[0_0_0_0_rgba(0,0,0,1.00)] translate-x-1.5 translate-y-1.5"
          : "shadow-neobrutalist-sm"
      )}
    >
      <QRCode className="h-full w-full" />
    </motion.button>
  );
};

export default QRCodeButton;
