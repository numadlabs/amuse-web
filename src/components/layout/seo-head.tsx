import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";

const domain = "https://web.amusebouche.io";

export default function SEOHead({
  title = "Amuse Bouche",
  description = "Earn  and redeem tokens for exclusive culinary experiences.",
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
      <meta property="og:image:width" content="1170" />
      <meta property="og:image:height" content="630" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={logo} />
      <link rel="icon" type="image/png" sizes="32x32" href={logo} />
      <link rel="icon" type="image/png" sizes="96x96" href={logo} />
      <link rel="icon" type="image/png" sizes="16x16" href={logo} />
    </Head>
  );
}
