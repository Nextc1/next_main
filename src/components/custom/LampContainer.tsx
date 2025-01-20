"use client";
import React from "react";
import { motion } from "framer-motion";
import { LampContainer } from "../aceternity/lamp";
import { PlaceholdersAndVanishInputDemo } from "./CustomInput";
import { PlaceholdersAndVanishInput } from "../aceternity/VanishInput";

export function CustomLamp() {
  const placeholders = ["Enter your email"];

  const Y_INIT_VALUE = 300;
  const Y_FINAL_VALUE = 150;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
  };
  return (
    <LampContainer>
      <motion.p
        initial={{ opacity: 0.5, y: Y_INIT_VALUE }}
        whileInView={{ opacity: 1, y: Y_FINAL_VALUE }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="py-4 mt-8 text-4xl font-bold tracking-tight text-center text-transparent bg-gradient-to-br text-beta from-slate-300 to-beta bg-clip-text md:text-7xl"
      >
        Join our Waitlist
      </motion.p>
      <motion.p
        initial={{ opacity: 0.5, y: Y_INIT_VALUE }}
        whileInView={{ opacity: 1, y: Y_FINAL_VALUE }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="max-w-3xl mx-auto my-2 text-center text-md text-beta"
      >
        Get early access to Exira, the future of real estate investment on the
        blockchain. Be the first to buy, trade, and invest in premium property
        shares through secure NFTs. Join our waitlist now to unlock exclusive
        benefits, early updates, and a front-row seat to the next generation of
        decentralized real estate investing. Don't miss out, secure your spot
        today!
      </motion.p>

      {/* <PlaceholdersAndVanishInputDemo /> */}

      <motion.div
        initial={{ opacity: 0.5, y: Y_INIT_VALUE }}
        whileInView={{ opacity: 1, y: Y_FINAL_VALUE }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative z-10 w-full mt-12"
      >
        <PlaceholdersAndVanishInput
          placeholders={placeholders}
          onChange={handleChange}
          onSubmit={onSubmit}
        />
      </motion.div>
    </LampContainer>
  );
}
