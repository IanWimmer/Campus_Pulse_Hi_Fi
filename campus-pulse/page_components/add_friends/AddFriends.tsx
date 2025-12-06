import PrimaryButton from "@/components/buttons/PrimaryButton";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import CheckboxInputForm from "@/components/input_fields/CheckboxInput";
import TextInput from "@/components/input_fields/TextInput";
import PersonOutlined from "@/public/icons/PersonOutlined";
import QRCode from "@/public/icons/QRCode";
import React, { MouseEvent, useState } from "react";

const AddFriends = ({
  onQRCodeClick = (event) => {},
}: {
  onQRCodeClick?: (event: MouseEvent) => any;
}) => {
  const [addedFriends, setAddedFriends] = useState<
    { ethz_username: string; alreadyUsingApp: boolean }[]
  >([]);
  // { ethz_username: "iwimmer", alreadyUsingApp: false }, { ethz_username: "iwimmer", alreadyUsingApp: true }, { ethz_username: "iwimmer", alreadyUsingApp: true }, { ethz_username: "iwimmer", alreadyUsingApp: true }, { ethz_username: "iwimmer", alreadyUsingApp: true },

  const [searchResults, setSearchResults] = useState<
    { ethz_username: string }[]
  >([]);
  // { ethz_username: "iwimmer" }, { ethz_username: "iwimmer" }, { ethz_username: "iwimmer" }, { ethz_username: "iwimmer" }, { ethz_username: "iwimmer" }, { ethz_username: "iwimmer" }, { ethz_username: "iwimmer" }

  return (
    <div className="h-full w-full px-5">
      <div className="h-[55%] pb-7 flex flex-col justify-between items-center">
        <div className="w-full h-[calc(100%-72px)]">
          <TextInput
            withEndIcon
            endIcon={<QRCode />}
            withPlaceholder
            placeholder="Search by nethz username..."
          />
          <div className="mt-4 h-[calc(100%-52px)] overflow-y-scroll">
            <CheckboxInputForm
              name={"search_result"}
              options={searchResults.map((res, index) => {
                return {
                  label: (
                    <div className="flex gap-5 items-center font-secondary">
                      <div className="h-11 w-11 flex items-center justify-center rounded-full border-2 border-black shadow-neobrutalist-sm">
                        <PersonOutlined className="h-6! w-6!" />
                      </div>
                      {res.ethz_username}
                    </div>
                  ),
                  value: res.ethz_username + index,
                };
              })}
              boxPositions="end"
            />
          </div>
        </div>
        <div className="w-[calc(100%-36px)]">
          <PrimaryButton text={"ADD FRIEND"} />
        </div>
      </div>
      <div className="h-[45%] pb-1.5">
        <div className="h-full border-2 border-black shadow-neobrutalist">
          <div className="h-13 border-b-2 border-black content-center text-center text-base font-semibold font-secondary">
            Added friends
          </div>
          <div className="flex flex-col px-5 pb-2 mt-3.5 gap-2.5 overflow-y-auto h-[calc(100%-80px)]">
            {addedFriends.map((friend, index) => {
              return (
                <div
                  key={friend.ethz_username + index}
                  className="flex justify-between"
                >
                  <div className="flex gap-5 items-center font-secondary">
                    <div className="h-11 w-11 flex items-center justify-center rounded-full border-2 border-black shadow-neobrutalist-sm">
                      <PersonOutlined className="h-6! w-6!" />
                    </div>
                    {friend.ethz_username}
                  </div>
                  <div className="h-11 flex items-center w-32 justify-center">
                    {friend.alreadyUsingApp ? (
                      <span className="font-semibold text-secondary text-sm">
                        ADDED
                      </span>
                    ) : (
                      <SecondaryButton
                        text={"INVITE"}
                        buttonClassName="h-6! w-32! text-sm!"
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFriends;
