import React, { useEffect, useState } from "react";
import ytLogo from "../assets/images/yt-logo.png";
import twitterLogo from "../assets/images/twitter-logo.png";
import facebookLogo from "../assets/images/facebook-logo.png";
import instagramLogo from "../assets/images/insta-logo.png";
import geolabLogo from "../assets/images/geolab-text.png";

const SOCIAL_LINKS = [
  {
    name: "YouTube",
    href: "https://www.youtube.com/user/CrytekHunt",
    alt: "YouTube Icon",
    icon: ytLogo,
  },
  {
    name: "X",
    href: "https://x.com/HuntShowdown",
    alt: "X Icon",
    icon: twitterLogo,
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/huntshowdown/",
    alt: "Facebook Icon",
    icon: facebookLogo,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/huntthegame/",
    alt: "Instagram Icon",
    icon: instagramLogo,
  },
];

const LEGAL_LINKS = [
  {
    label: "Privacy Policy",
    href: "https://www.crytek.com/privacy-policy",
  },
  {
    label: "Cookie Policy",
    href: "https://www.crytek.com/cookie-policy",
  },
  {
    label: "Terms of Services",
    href: "https://www.crytek.com/terms",
  },
  {
    label: "Xsolla Refund Policy",
    href: "https://xsolla.com/refund-policy",
  },
];

const Footer = () => {
  return (
    <footer
      data-layout="responsive-footer"
      className="w-full max-h-[400px] md:max-h-none bg-[#27272A] text-zinc-300 border-t border-zinc-700/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 flex flex-col justify-between gap-5 md:gap-8">
        {/* Upper Section: Logo + Social Icons + Legal Links */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-5 md:gap-8">
          {/* 1. Brand Logo Placeholder */}
          <div className="flex-shrink-0">
            <a
              href="https://geolab.edu.ge/en/"
              className="inline-flex items-center"
            >
              <img
                src={geolabLogo}
                alt="Geolab Logo"
                className="max-w-[75px] max-h-[75px] w-auto h-auto object-contain rounded-sm"
              />
            </a>
          </div>

          {/* Right Column (Desktop) / Stacked Section (Compact Viewport) */}
          <div className="flex flex-col items-center md:items-end gap-4">
            {/* 2. Social Icons Bar */}
            <nav
              aria-label="Social Media Links"
              className="flex items-center gap-4"
            >
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="p-2 rounded-md bg-zinc-900/80 hover:bg-zinc-700 transition-colors cursor-pointer"
                >
                  <img
                    src={social.icon}
                    alt={social.alt}
                    className="w-5 h-5 object-contain rounded-sm"
                  />
                </a>
              ))}
            </nav>

            {/* 3. Policy & Legal Links */}
            <nav
              aria-label="Legal Navigation"
              className="flex flex-wrap items-center justify-center md:justify-end gap-x-5 gap-y-2 text-sm tracking-wider uppercase text-zinc-200"
            >
              {LEGAL_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-indigo-400 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* 4. Bottom Copyright & Trademarks */}
        <div className="pt-4 border-t border-zinc-700/70 text-center text-xs sm:text-sm leading-relaxed text-zinc-400 space-y-1">
          <p>© 2026 Crytek GmbH. All rights reserved.</p>
          <p>
            Crytek, CRYENGINE, Hunt Showdown, Port Sulphur Band and the
            respective logos are trademarks or registered trademarks of the
            Crytek group in the EU, U.S. and/or other territories. All other
            trademarks are the property of their respective owners.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
