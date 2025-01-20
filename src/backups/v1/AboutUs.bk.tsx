import React from "react";
import Footer from "../../components/custom/Footer";

function AboutUs(props) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col gap-y-3">
        <div className="text-3xl">Our Vision</div>
        <div className="flex flex-col gap-y-0">
          <p className="font-black text-9xl">Real Estate</p>
          <p className="font-black text-9xl">For Everyone</p>
        </div>
        <p className="text-2xl text-center w-[80rem] mt-2">
          We envision a world where real estate investment isn’t limited to a
          select few, but a powerful tool for everyone to build wealth. Our
          platform allows people from all walks of life to invest in premium
          properties, unlocking financial freedom and growth.
        </p>
      </div>

      {/* our values */}
      <div className="flex flex-col mt-16">
        <p className="text-3xl">Our Values</p>
        <div className="flex flex-row items-center mt-5 gap-x-36">
          <p className="text-5xl font-black w-[18rem]">Transparency.</p>
          <p className="text-5xl font-black w-[18rem]">Accessibility.</p>
          <p className="text-5xl font-black w-[18rem]">Security.</p>
        </div>
      </div>

      {/* who we are */}
      <div className="flex flex-row items-start justify-center mt-56 mb-20">
        {/* left container */}
        <div className="flex flex-col items-start gap-y-3">
          <p className="text-4xl font-bold">Who We Are</p>
          <p className="text-xl text-left w-[45rem]">
            We are a group of passionate entrepreneur and tech innovators who
            believe in breaking down barriers. We're building a platform that
            allows everyday people to invest in real estate shares, offering
            access to properties that were once out of reach.
          </p>
        </div>

        {/* right container */}
        <div className="flex flex-col items-start justify-center gap-y-10">
          {/* nimesh */}
          <div className="flex flex-col gap-y-2">
            <div className="flex flex-col items-start">
              <p className="text-xl font-bold">
                Nimesh Chedella
                <span className="text-lg font-normal">
                  &nbsp;&nbsp;Co-Founder, CEO
                </span>
              </p>
              <p className="italic font-bold text-gray-400 text-md">
                IIT Madras, Ex-Googler
              </p>
            </div>
            <div>
              <p className="text-left w-[40rem] text-lg">
                We are a group of passionate entrepreneur and tech innovators
                who believe in breaking down barriers. We're building a platform
                that allows everyday people to invest in real estate shares,
                offering access to properties that were once out of reach.
              </p>
            </div>
          </div>

          {/* sudhir */}
          <div className="flex flex-col gap-y-2">
            <div className="flex flex-col items-start">
              <p className="text-xl font-bold">
                Nimesh Chedella
                <span className="text-lg font-normal">
                  &nbsp;&nbsp;Co-Founder, CEO
                </span>
              </p>
              <p className="italic font-bold text-gray-400 text-md">
                IIT Madras, Ex-Googler
              </p>
            </div>
            <div>
              <p className="text-left w-[40rem] text-lg">
                We are a group of passionate entrepreneur and tech innovators
                who believe in breaking down barriers. We're building a platform
                that allows everyday people to invest in real estate shares,
                offering access to properties that were once out of reach.
              </p>
            </div>
          </div>

          {/* manu */}
          <div className="flex flex-col gap-y-2">
            <div className="flex flex-col items-start">
              <p className="text-xl font-bold">
                Nimesh Chedella
                <span className="text-lg font-normal">
                  &nbsp;&nbsp;Co-Founder, CEO
                </span>
              </p>
              <p className="italic font-bold text-gray-400 text-md">
                IIT Madras, Ex-Googler
              </p>
            </div>
            <div>
              <p className="text-left w-[40rem] text-lg">
                We are a group of passionate entrepreneur and tech innovators
                who believe in breaking down barriers. We're building a platform
                that allows everyday people to invest in real estate shares,
                offering access to properties that were once out of reach.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* why we are different */}
      <div className="flex flex-col items-start p-20 my-20 bg-black gap-y-2 rounded-3xl w-[70rem]">
        {/* header */}
        <div className="flex flex-col items-start mb-8 gap-y-2">
          <p className="text-5xl font-bold text-white">
            Why We Are
            <span className="text-5xl font-bold text-amber-600">
              &nbsp;Different
            </span>
            ?
          </p>
          <p className="text-3xl text-left text-white">
            We’re reimagining real estate investment by combining accessibility,
            flexibility, and transparency.
          </p>
        </div>

        {/* body */}
        <div className="grid items-start grid-cols-2 mt-8 gap-x-20 gap-y-16">
          {/* grid one */}
          <div className="flex flex-col items-start gap-y-2">
            <p className="text-3xl font-bold text-left text-white">
              Own a <span className="text-amber-600">Share of Premium</span>{" "}
              Real Estate
            </p>
            <p className="text-xl text-left text-white">
              Start investing in high-value properties with small amounts
              through fractional ownership. No massive upfront costs—just a
              simple way to access real estate.
            </p>
          </div>

          {/* grid two */}
          <div className="flex flex-col items-start gap-y-2">
            <p className="text-3xl font-bold text-left text-white">
              <span className="text-amber-600">Invest and Trade</span>
              &nbsp;with Flexibility
            </p>
            <p className="text-xl text-left text-white">
              Unlike traditional property investments, your shares are not
              locked in. Buy, sell, or trade your real estate shares anytime,
              just like you would in the stock market.
            </p>
          </div>

          {/* grid one */}
          <div className="flex flex-col items-start gap-y-2">
            <p className="text-3xl font-bold text-left text-white">
              <span className="text-amber-600">Diversify</span> Without the
              Headache
            </p>
            <p className="text-xl text-left text-white">
              Build a diverse portfolio across different property
              types—residential, commercial, or industrial—all without the
              hassle of property management or maintenance.
            </p>
          </div>

          {/* grid two */}
          <div className="flex flex-col items-start gap-y-2">
            <p className="text-3xl font-bold text-left text-white">
              <span className="text-amber-600">Secure and Stable</span>{" "}
              Investments
            </p>
            <p className="text-xl text-left text-white">
              Unlike traditional property investments,Your investments are
              backed by real properties, which tend to appreciate over time,
              offering more stability than stocks or crypto. You’re investing in
              tangible assets with long-term growth potential.
            </p>
          </div>

          <div className="flex flex-col items-start gap-y-2">
            <p className="text-3xl font-bold text-left text-white">
              Full&nbsp;
              <span className="text-amber-600">Transparency and Control</span>
            </p>
            <p className="text-xl text-left text-white">
              Track the performance of your shares in real-time. Know exactly
              where your money is going, how your investments are performing,
              and make informed decisions with ease.
            </p>
          </div>

          <div className="flex flex-col items-start gap-y-2">
            <p className="text-3xl font-bold text-left text-white">
              <span className="text-amber-600">Diversify</span> Without the
              Headache
            </p>
            <p className="text-xl text-left text-white">
              Build a diverse portfolio across different property
              types—residential, commercial, or industrial—all without the
              hassle of property management or maintenance.
            </p>
          </div>
        </div>
      </div>

      {/* timeline */}
      <div className="my-20">
        {/* header */}
        <div className="flex flex-col items-center gap-y-2">
          <p className="text-5xl font-bold">Our Roadmap</p>
          <p className="text-xl text-center w-[50rem]">
            We’re excited to bring this vision to life. Soon, you’ll be able to
            start investing in real estate shares, no matter where you are in
            your financial journey.
          </p>
        </div>

        {/* roadmap */}
        <div className="w-[50rem] items-center justify-center text-left mt-16">
          <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical">
            <li>
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
              <div className="mb-10 timeline-start md:text-end">
                <time className="text-lg italic">Q4, 2024</time>
                <div className="text-3xl font-bold">
                  Platform Development & Beta Launch
                </div>
                <p className="text-xl">
                  We’re focused on building a seamless and secure platform for
                  you to start investing. Soon, we’ll launch our beta version,
                  allowing early users to explore and invest in their first real
                  estate shares.
                </p>
              </div>
              <hr />
            </li>
            <li>
              <hr />
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
              <div className="mb-10 timeline-end">
                <time className="text-lg italic">Q1, 2025</time>
                <div className="text-3xl font-bold">
                  Property Listings & Investment Opportunities
                </div>
                <p className="text-xl">
                  We’ll introduce a range of high-value properties for
                  fractional ownership. Our marketplace will let you browse,
                  invest, and begin growing your portfolio with ease.
                </p>
              </div>
              <hr />
            </li>
            <li>
              <hr />
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
              <div className="mb-10 timeline-start md:text-end">
                <time className="text-lg italic">Q1, 2025</time>
                <div className="text-3xl font-bold">
                  Real Estate Trading Platform
                </div>
                <p className="text-xl">
                  We’re developing features that will allow you to actively
                  trade your shares. This means more flexibility to buy, sell,
                  or trade shares as property values change, making real estate
                  a dynamic asset.
                </p>
              </div>
              <hr />
            </li>
            <li>
              <hr />
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
              <div className="mb-10 timeline-end">
                <time className="text-lg italic">Q1, 2025</time>
                <div className="text-3xl font-bold">
                  Expanding Property Types
                </div>
                <p className="text-xl">
                  From residential to commercial and even industrial, we’ll
                  continue to expand the types of properties available for
                  investment, giving you more choices and opportunities to
                  diversify.
                </p>
              </div>
              <hr />
            </li>
            <li>
              <hr />
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
              <div className="mb-10 timeline-start md:text-end">
                <time className="text-lg italic">Q1, 2025</time>
                <div className="text-3xl font-bold">
                  Scaling & Global Expansion
                </div>
                <p className="text-xl">
                  Our goal is to bring real estate investment to a global scale.
                  We’ll continue to grow our property listings and enhance our
                  platform to serve investors worldwide.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* contact us */}
      <div className="flex flex-col items-center justify-center mt-32 mb-44 gap-y-3">
        <p className="text-4xl font-bold">
          Got questions or want to know more? We’d love to hear from you!
        </p>
        <p className="text-3xl">connect@nextcarbon.in</p>
      </div>

      {/* footer */}
      <Footer />
    </div>
  );
}

export default AboutUs;
