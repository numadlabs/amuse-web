import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";

const domain = "https://web.amusebouche.io";

export default function AmuseWebAppSEO({
  title = "Amuse Bouche - Your Digital Culinary Passport",
  description = "Access exclusive rewards, check in at top restaurants, and manage your culinary journey with Amuse Bouche.",
  logo = `${domain}/img/og.png`,
}) {
  const router = useRouter();
  const currentUrl = `${domain}${router.asPath}`;

  return (
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />
      <meta name="theme-color" content="#000000" />
      <meta name="author" content="developed by Numad Labs" />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="title" content={title} />
      <meta property="og:locale" content="en_EN" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:site_name" content={domain.replace("https://", "")} />
      <meta property="og:image" content={logo} />
      <meta property="og:image:secure_url" content={logo} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={logo} />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link rel="manifest" href="/site.webmanifest" />
      <meta name="application-name" content="Amuse Bouche" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Amuse Bouche" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
    </Head>
  );
}
