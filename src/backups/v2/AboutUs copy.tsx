import React from "react";
import Footer from "../../components/custom/Footer";

// import nimesh from "../assets/img/nimesh-no-bg.png";
// import sudhir from "../assets/img/sudhir-no-bg.png";
// import manu from "../assets/img/manu-no-bg.png";

import nimesh from "../assets/img/nimesh-c.png";
import sudhir from "../assets/img/sudhir-c.png";
import manu from "../assets/img/manu-c.png";

function AboutUs(props) {
  return (
    <>
      <div className="flex flex-col items-center justify-center px-4 md:px-8 lg:px-16">
        {/* Vision Section */}
        <div className="flex flex-col mt-8 gap-y-4 md:mt-12">
          <h2 className="text-2xl md:text-3xl">Our Vision</h2>
          <div className="flex flex-col gap-y-2">
            <p className="text-5xl font-black md:text-7xl lg:text-9xl">
              Real Estate
            </p>
            <p className="text-5xl font-black md:text-7xl lg:text-9xl">
              For Everyone
            </p>
          </div>
          <p className="max-w-4xl mt-2 text-lg text-center md:text-xl lg:text-2xl lg:max-w-5xl">
            We envision a world where real estate investment isn’t limited to a
            select few, but a powerful tool for everyone to build wealth. Our
            platform allows people from all walks of life to invest in premium
            properties, unlocking financial freedom and growth.
          </p>
        </div>

        {/* Our Values Section */}
        <div className="flex flex-col mt-16 md:mt-24">
          <h2 className="text-2xl md:text-3xl">Our Values</h2>
          <div className="flex flex-col items-center justify-around mt-5 md:flex-row gap-y-4 md:gap-y-0 md:gap-x-8">
            <p className="w-full text-4xl font-black text-center md:text-5xl md:w-auto">
              Transparency
            </p>
            <p className="w-full text-4xl font-black text-center md:text-5xl md:w-auto">
              Accessibility
            </p>
            <p className="w-full text-4xl font-black text-center md:text-5xl md:w-auto">
              Security
            </p>
          </div>
        </div>

        {/* Who We Are Section */}
        <div className="flex flex-col items-start justify-center mt-16 lg:flex-row md:mt-24 gap-y-12 lg:gap-y-0 lg:gap-x-16">
          {/* Left container */}
          <div className="flex flex-col items-start gap-y-4 lg:w-1/2">
            <h2 className="text-3xl font-bold md:text-4xl">Who We Are</h2>
            <p className="text-base text-left md:text-lg lg:text-xl">
              We are a group of passionate entrepreneurs and tech innovators who
              believe in breaking down barriers. We're building a platform that
              allows everyday people to invest in real estate shares, offering
              access to properties that were once out of reach.
            </p>
            <div className="mt-8">
              <div className="-space-x-3 avatar-group rtl:space-x-reverse">
                <div className="avatar">
                  <div className="w-60">
                    <img src={nimesh} className="grayscale" />
                  </div>
                </div>
                <div className="avatar">
                  <div className="w-60">
                    <img src={sudhir} className="grayscale" />
                  </div>
                </div>
                <div className="avatar">
                  <div className="w-60">
                    <img src={manu} className="grayscale" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right container */}
          <div className="flex flex-col items-start justify-center gap-y-8 lg:w-1/2">
            {[
              {
                name: "Nimesh Chedella",
                position: "Co-Founder, CEO",
                experience: "IIT Madras, Ex-Googler",
              },
              {
                name: "Sudhir S",
                position: "Co-Founder, COO",
                experience: "IIT Madras",
              },
              {
                name: "Manu Areraa",
                position: "Co-Founder, CTO",
                experience: "Blockchain Engineer",
              },
            ].map((item, index) => (
              <div key={index} className="flex flex-col gap-y-2">
                <div className="flex flex-col items-start">
                  <p className="text-lg font-bold md:text-xl">
                    {item.name}
                    <span className="font-normal text-md md:text-lg">
                      &nbsp;&nbsp;{item.position}
                    </span>
                  </p>
                  <p className="text-sm italic font-bold text-gray-400 md:text-md">
                    {item.experience}
                  </p>
                </div>
                <p className="text-sm text-left md:text-base lg:text-lg">
                  We are a group of passionate entrepreneurs and tech innovators
                  who believe in breaking down barriers. We're building a
                  platform that allows everyday people to invest in real estate
                  shares, offering access to properties that were once out of
                  reach.
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Why We Are Different Section */}
        <div className="flex flex-col items-start max-w-full p-8 my-16 bg-black md:p-12 lg:p-20 md:my-24 lg:my-32 rounded-3xl md:max-w-4xl lg:max-w-5xl">
          <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            Why We Are<span className="text-amber-600"> Different</span>?
          </h2>
          <p className="text-lg text-left text-white md:text-xl lg:text-2xl">
            We’re reimagining real estate investment by combining accessibility,
            flexibility, and transparency.
          </p>

          {/* Body */}
          <div className="grid items-start grid-cols-1 mt-12 md:grid-cols-2 gap-x-16 gap-y-8 md:gap-y-16">
            {[
              {
                title: "Own a Share of Premium Real Estate",
                content:
                  "Start investing in high-value properties with small amounts through fractional ownership. No massive upfront costs—just a simple way to access real estate.",
              },
              {
                title: "Invest and Trade with Flexibility",
                content:
                  "Unlike traditional property investments, your shares are not locked in. Buy, sell, or trade your real estate shares anytime, just like you would in the stock market.",
              },
              {
                title: "Diversify Without the Headache",
                content:
                  "Build a diverse portfolio across different property types—residential, commercial, or industrial—all without the hassle of property management or maintenance.",
              },
              {
                title: "Secure and Stable Investments",
                content:
                  "Your investments are backed by real properties, which tend to appreciate over time, offering more stability than stocks or crypto. You’re investing in tangible assets with long-term growth potential.",
              },
              {
                title: "Full Transparency and Control",
                content:
                  "Track the performance of your shares in real-time. Know exactly where your money is going, how your investments are performing, and make informed decisions with ease.",
              },
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-start gap-y-2">
                <p className="text-lg font-bold text-white md:text-2xl">
                  {item.title}
                </p>
                <p className="text-sm text-left text-white md:text-lg">{item.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Our Roadmap Section */}
        <div className="max-w-full px-4 my-20 lg:max-w-5xl">
          <h2 className="mb-6 text-3xl font-bold text-center md:text-4xl lg:text-5xl">
            Our Roadmap
          </h2>
          <p className="mb-8 text-base text-center md:text-lg lg:text-xl">
            We’re excited to bring this vision to life. Soon, you’ll be able to
            start investing in real estate shares, no matter where you are in
            your financial journey.
          </p>

          {/* Roadmap */}
          <ul className="space-y-0 timeline timeline-snap-icon timeline-vertical">
            {[
              {
                time: "Q4, 2024",
                title: "Platform Development & Beta Launch",
                content:
                  "We’re focused on building a seamless and secure platform for you to start investing. Soon, we’ll launch our beta version, allowing early users to explore and invest in their first real estate shares.",
              },
              {
                time: "Q1, 2025",
                title: "Property Listings & Investment Opportunities",
                content:
                  "We’ll introduce a range of high-value properties for fractional ownership. Our marketplace will let you browse, invest, and begin growing your portfolio with ease.",
              },
              {
                time: "Q1, 2025",
                title: "Real Estate Trading Platform",
                content:
                  "We’re developing features that will allow you to actively trade your shares. This means more flexibility to buy, sell, or trade shares as property values change, making real estate a dynamic asset.",
              },
              {
                time: "Q1, 2025",
                title: "Expanding Property Types",
                content:
                  "From residential to commercial and even industrial, we’ll continue to expand the types of properties available for investment, giving you more choices and opportunities to diversify.",
              },
              {
                time: "Q1, 2025",
                title: "Scaling & Global Expansion",
                content:
                  "Our goal is to bring real estate investment to a global scale. We’ll continue to grow our property listings and enhance our platform to serve investors worldwide.",
              },
            ].map((item, index) => (
              <li key={index} className="timeline-item">
                <div className="timeline-middle">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div
                  className={`mb-0 ${
                    index % 2 === 0
                      ? "timeline-start md:text-end"
                      : "timeline-end"
                  }`}
                >
                  <time className="text-lg italic">{item.time}</time>
                  <h3 className="text-2xl font-bold md:text-3xl">
                    {item.title}
                  </h3>
                  <p className="text-base md:text-lg">{item.content}</p>
                </div>
                {index !== 4 && <hr />}
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Us Section */}
        <div className="flex flex-col items-center justify-center px-4 mt-32 text-center mb-44 gap-y-3">
          <p className="text-3xl font-bold md:text-4xl">
            Got questions or want to know more? We’d love to hear from you!
          </p>
          <p className="text-lg md:text-2xl">connect@exira.io</p>
        </div>
        {/* Footer */}
      </div>
      <Footer />
    </>
  );
}

export default AboutUs;
