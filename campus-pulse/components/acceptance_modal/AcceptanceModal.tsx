import clsx from "clsx";
import React from "react";
import { createPortal } from "react-dom";
import PrimaryButton from "../buttons/PrimaryButton";
import NegativeButton from "../buttons/NegativeButton";

const AcceptanceModal = ({
  onAcceptance = () => {},
  onRejection = () => {},
  acceptanceButtonText = "Accept",
  rejectionButtonText = "Reject",
  modalTitle = "",
  modalContent = "",
  buttonDirectionReversed = false,
  acceptanceButtonPrimary = true,
  rejectionButtonPrimary = true,
}: {
  onAcceptance?: () => any;
  onRejection?: () => any;
  acceptanceButtonText?: string | React.ReactNode;
  rejectionButtonText?: string | React.ReactNode;
  modalTitle?: string | React.ReactNode;
  modalContent?: string | React.ReactNode;
  buttonDirectionReversed?: boolean;
  acceptanceButtonPrimary?: boolean;
  rejectionButtonPrimary?: boolean;
}) => {
  return createPortal(
    <div
      className={clsx(
        "fixed top-0 left-0 z-999 h-[calc(var(--vh,1vh)*100)] w-screen bg-[rgba(255,255,255,0.5)] flex justify-center items-center px-5 py-10"
      )}
    >
      <div className="w-full h-fit bg-white shadow-neobrutalist border-2 border-black">
        <h1 className="text-2xl font-bold border-b-2 border-b-black p-2">
          {modalTitle}
        </h1>
        <div className="p-2">
          <p className="font-secondary pb-5">{modalContent}</p>
          <div className={clsx("flex pb-1 gap-2", buttonDirectionReversed && "flex-row-reverse")}>
            <div className="w-1/2">
              <PrimaryButton text={acceptanceButtonText} onClick={() => onAcceptance()} buttonClassName={!acceptanceButtonPrimary ? "bg-white! text-secondary!" : ""} />
            </div>
            <div className="w-1/2">
              <NegativeButton text={rejectionButtonText} onClick={() => onRejection()} buttonClassName={!rejectionButtonPrimary ? "bg-white! text-negative!" : ""} />
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AcceptanceModal;
