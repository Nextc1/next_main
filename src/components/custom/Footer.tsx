import React from "react";

function Footer(props) {
  return (
    <footer className="p-2 text-white bg-black lg:p-4 md:p-4 footer footer-center">
      <aside>
        <p className="lg:text-lg md:text-lg text-md">
          Copyright © {new Date().getFullYear()} - All right reserved by Exira
          Investments Pvt.
        </p>
      </aside>
    </footer>
  );
}

export default Footer;
