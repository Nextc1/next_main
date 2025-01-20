import { Input } from "@nextui-org/react";
import React, { useState } from "react";
import { PlaceholdersAndVanishInputDemo } from "../components/custom/CustomInput";
import { PlaceholdersAndVanishInput } from "../components/aceternity/VanishInput";
import { AuroraBackground } from "../components/aceternity/auroraBackground";
import { motion } from "framer-motion";

const Waitlist: React.FC = () => {
  const [value, setValue] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
      {/* Hero Section */}
      <div className="w-full p-4 text-center max-w-7xl lg:px-8">
        {/* heading container */}
        <AuroraBackground>
          <motion.div
            initial={{ opacity: 0.0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.3,
              duration: 0.8,
              ease: "easeInOut",
            }}
            className="relative flex flex-col items-center justify-center gap-4 px-2 py-16 sm:px-4 lg:px-20 lg:py-20 rounded-3xl"
          >
            <div className="w-full p-4">
              <h1 className="mb-4 text-4xl font-bold sm:text-5xl lg:text-7xl text-beta">
                Welcome to the Future of Real Estate Investment!
              </h1>
              <p className="mb-6 text-lg sm:text-xl text-beta">
                Unlock Exclusive Access to the Next Generation of Property
                Ownership
              </p>

              <PlaceholdersAndVanishInput
                placeholders={["Enter your email address"]}
                onChange={handleChange}
                onSubmit={onSubmit}
              />
            </div>
          </motion.div>
        </AuroraBackground>

        {/* Information Section */}
        <div className="flex flex-col items-start w-full gap-10 mt-16 lg:flex-row">
          {/* why join the waitlist */}
          <div className="w-full space-y-4 text-left lg:w-2/5">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Why Join the Waitlist?
            </h2>
            <ul className="text-base text-gray-700 list-disc list-inside sm:text-lg">
              <li>Be the First to Access Fractional Real Estate Shares</li>
              <li>Exclusive Early-Bird Benefits for Waitlist Members</li>
              <li>Get Priority Access to High-Growth, Verified Properties</li>
              <li>Participate in Our Launchpad for New Real Estate Projects</li>
              <li>Earn Passive Income from Real Estate Without Hassle</li>
            </ul>
          </div>

          {/* Explanatory Text */}
          <div className="w-full lg:w-3/5">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Fractional Ownership Made Simple
              </h2>
              <p className="mt-2 text-base text-gray-700 sm:text-lg">
                Invest in premium real estate with just a few clicks. No huge
                upfront costs. No property management headaches. Just secure,
                profitable real estate investments at your fingertips.
              </p>
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                A Platform Built for You
              </h2>
              <p className="mt-2 text-base text-gray-700 sm:text-lg">
                Next Carbon is built on blockchain technology, ensuring every
                investment is transparent, secure, and tradeable. Use your Carbon
                Credit shares as collateral, trade them in our marketplace, or
                simply sit back and enjoy the passive income.
              </p>
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Don’t Miss Out!
              </h2>
              <p className="mt-2 text-base text-gray-700 sm:text-lg">
                By joining our waitlist, you’ll gain priority access to the
                future of real estate investment. Whether you’re new to property
                investment or a seasoned investor, Exira opens up premium
                properties for everyone.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Waitlist;
