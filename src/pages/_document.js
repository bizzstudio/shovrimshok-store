// src/pages/_document.js
import SettingServices from "@services/SettingServices";
import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    let setting = null;
    let scripts = null;
    let error = null;

    // נטען seo ו-scripts במקביל; כשלון של אחד לא יפיל את השני
    const [seoRes, scriptsRes] = await Promise.allSettled([
      SettingServices.getStoreSeoSetting(),
      SettingServices.getStoreScriptsSetting(),
    ]);

    if (seoRes.status === "fulfilled") {
      setting = seoRes.value;
    } else {
      error = true;
      console.error("Failed to fetch seo settings:", seoRes.reason);
    }

    if (scriptsRes.status === "fulfilled") {
      scripts = scriptsRes.value;
    } else {
      console.error("Failed to fetch scripts settings:", scriptsRes.reason);
    }

    return { ...initialProps, setting, scripts, error };
  }

  render() {
    const { setting, scripts, error } = this.props;
    const { seo } = setting || {};
    const { favicon, meta_description, meta_img, meta_keywords, meta_title, meta_url } = seo || {};
    const { head: scriptsHead = "", bodyStart: scriptsBodyStart = "", bodyEnd: scriptsBodyEnd = "" } = scripts || {};

    // Check if there was an error during data fetching — still must render required Next.js components

    return (
      <Html lang="he" dir="rtl">
        <Head>
          <link rel="icon" href={favicon || "/shapira_leaf.svg"} />

          {/* Regular meta tags that Google prefers */}
          <title>{meta_title || "שוברים שוק"}</title>
          <meta 
            name="description" 
            content={meta_description || 'שוברים שוק - ספקי שיווק מזון מורשים, במכירה ישירה ללא פערי תיווך, משלוחים / איסוף עצמי - הזמינו אונליין'}
          />

          {/* Google Tag Manager */}
          {/* <script async src="https://www.googletagmanager.com/gtag/js?id=G-R5FJVK2CGS"></script>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-R5FJVK2CGS');
              `,
            }}
          /> */}

          {/* Google Tag Manager */}
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','GTM-MB385SWB');`,
            }}
          />
          {/* End Google Tag Manager */}

          <meta
            property="og:title"
            content={
              meta_title ||
              "שוברים שוק"
            }
          />
          <meta property="og:type" content="eCommerce Website" />
          <meta
            property="og:description"
            content={
              meta_description ||
             'שוברים שוק - ספקי שיווק מזון מורשים, במכירה ישירה ללא פערי תיווך, משלוחים / איסוף עצמי - הזמינו אונליין'
            }
          />
          <meta
            name="keywords"
            content={meta_keywords || "שוברים שוק - ספקי שיווק מזון מורשים"}
          />
          <meta
            property="og:url"
            content={
              meta_url || "https://shapirabro.co.il/"
            }
          />
          <meta
            property="og:image"
            content={
              meta_img ||
              'https://bizzstudio.s3.eu-north-1.amazonaws.com/seo/9229c1df-26a4-47d4-a1d2-22768161f6de_logo_shapira_brothers.png'
            }
          />

          {/* Custom <head> scripts/tags from admin (storeScriptsSetting.head) */}
          {scriptsHead && (
            <script dangerouslySetInnerHTML={{ __html: scriptsHead }} />
          )}
        </Head>
        <body>
          {/* Custom body-start scripts from admin (storeScriptsSetting.bodyStart) */}
          {scriptsBodyStart && (
            <script dangerouslySetInnerHTML={{ __html: scriptsBodyStart }} />
          )}

          {/* Google Tag Manager (noscript) */}
          <noscript>
            <iframe
              src="https://www.googletagmanager.com/ns.html?id=GTM-MB385SWB"
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            ></iframe>
          </noscript>
          {/* End Google Tag Manager (noscript) */}

          <Main />
          <NextScript />
          <script src="https://cdn.enable.co.il/licenses/enable-L669sin2yb9r7u-1017-72361/init.js"></script>

          {/* Custom body-end scripts from admin (storeScriptsSetting.bodyEnd) */}
          {scriptsBodyEnd && (
            <script dangerouslySetInnerHTML={{ __html: scriptsBodyEnd }} />
          )}
        </body>
      </Html>
    );
  }
}

export default MyDocument;
