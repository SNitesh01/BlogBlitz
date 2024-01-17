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
            <span>Meeting current</span>
            <br /> needs now
          </strong>
          <p>
            You can prioritize a child’s mental, emotional, <br />
            behavioral, and physical health{" "}
          </p>
          <Link href="/register">Get started now</Link>
        </div>
      </div>
    </section>
  );
};

export default BannerSection;
