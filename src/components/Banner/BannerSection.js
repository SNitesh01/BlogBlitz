import React from "react";
import "./BannerSection.css";
import Link from "next/link";

const BannerSection = () => {
  return (
    <section className="ban_sec">
      <div className="ban_img">
        <img
          src="https://wphix.com/template/sikkha-prv/sikkha/img/slider/slider_bg_1.jpg"
          alt="banner"
          border="0"
        />
        <div className="ban_text">
          <strong>
            <span>Express your passions</span>
            <br /> ideas on your terms
          </strong>
          <p>
            Craft your unique blog with style. Choose from user-friendly
            templates,
            <br /> each with versatile layouts and myriad background images.
          </p>
          <Link href="/login">Get started now</Link>
        </div>
      </div>
    </section>
  );
};

export default BannerSection;
