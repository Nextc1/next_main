import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import solanaLogo from "../../assets/img/solanaLogo.png";

function HomeChain(props) {
  return (
    <div className="container flex flex-col items-center justify-center mx-auto my-28">
      <div className="flex flex-col text-center gap-y-2">
        <p className="text-4xl font-bold">
          Made with {/* Powered by{" "} */}
          <FontAwesomeIcon
            icon={faHeart}
            style={{ color: "#cb2a2a" }}
            size="xs"
          />{" "}
          on Solana
        </p>
        <p className="max-w-2xl text-lg leading-tight">
          Our platform is currently being developed on Solana as part of the
          ongoing hackathon. Solana's high speed and low fees make it the
          perfect foundation for our vision. Stay tuned as we leverage the power
          of Solana to deliver a seamless experience.
        </p>
      </div>

      {/* Logo container */}
      <div className="px-10 py-4 my-8 bg-black rounded-2xl">
        <img src={solanaLogo} alt="Solana Logo" className="h-auto w-52" />
      </div>
    </div>
  );
}

export default HomeChain;
