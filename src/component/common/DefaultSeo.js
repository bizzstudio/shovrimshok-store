// shapira-store/src/component/common/DefaultSeo.js
import React from "react";
import { DefaultSeo as NextSeo } from "next-seo";

// Internal import
import useAsync from "@hooks/useAsync";
import SettingServices from "@services/SettingServices";
import useGetSetting from "@hooks/useGetSetting";

const DefaultSeo = () => {
  const { storeCustomizationSetting } = useGetSetting() || {};
  const { seo } = storeCustomizationSetting || {};
  const { favicon, meta_description, meta_img, meta_keywords, meta_title, meta_url } = seo || {};

  return (
    <NextSeo
      title={meta_title || "שוברים שוק"}
      openGraph={{
        type: "website",
        locale: "he_IL",
        url: meta_url || "https://shapirabro.co.il",
        site_name: meta_title || "שוברים שוק",
      }}
      twitter={{
        handle: "@handle",
        site: "@site",
        cardType: "summary_large_image",
      }}
      additionalMetaTags={[
        {
          name: "viewport",
          content:
            "minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover",
        },
        {
          name: "apple-mobile-web-app-capable",
          content: "yes",
        },
        {
          name: "theme-color",
          content: "#ffffff",
        },
      ]}
      additionalLinkTags={[
        {
          rel: "apple-touch-icon",
          href: "/icon-192x192.png",
        },
        {
          rel: "manifest",
          href: "/manifest.json",
        },
      ]}
    />
  );
};

export default DefaultSeo;
