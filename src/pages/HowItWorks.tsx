import React from "react";
import howitworks from "../assets/img/how it works.svg";
import Footer from "../components/custom/Footer";

function HowItWorks(props) {
  return (
    <>
      <div className="flex flex-col items-center justify-center px-4 gap-y-4 md:px-8 lg:px-12">
        {/* heading */}
        <div className="flex flex-col items-center justify-center mt-12 gap-y-4">
          <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl">
            How it works?
          </h1>
        </div>

        {/* content */}
        <div className="max-w-full mt-16 mb-36">
          <img
            src={howitworks}
            alt="how it works"
            className="object-contain w-full h-auto" // Ensures the image scales responsively
          />
        </div>
      </div>
      <Footer />
    </>
  );
}

export default HowItWorks;
