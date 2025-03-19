// src/pages/_document.js
import SettingServices from "@services/SettingServices";
import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    let setting = null;
    let error = null;

    try {
      // Fetch general metadata from backend API
      setting = await SettingServices.getStoreSeoSetting();
    } catch (err) {
      error = true; // Mark error
      console.error("Failed to fetch settings:", err);
    }

    return { ...initialProps, setting, error };
  }

  render() {
    const { setting, error } = this.props;

    // Check if there was an error during data fetching
    if (error) {
      return (
        <Html lang="he" dir="rtl">
          <head>
            <title>שגיאה - האתר אינו זמין</title>
          </head>
          <body>
            <h1>שגיאה</h1>
            <p>מצטערים, האתר אינו זמין כרגע. נסה שוב מאוחר יותר.</p>
          </body>
        </Html>
      );
    }

    return (
      <Html lang="he" dir="rtl">
        <Head>
          <link rel="icon" href={setting?.favicon || "/favicon.png"} />

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
              setting?.meta_title ||
              "משק קירשנר - פירות וירקות מזמינים אונליין"
            }
          />
          <meta property="og:type" content="eCommerce Website" />
          <meta
            property="og:description"
            content={
              setting?.meta_description ||
              "משק קירשנר - פירות וירקות מזמינים אונליין"
            }
          />
          <meta
            name="keywords"
            content={setting?.meta_keywords || "משק קירשנר - פירות וירקות מזמינים אונליין"}
          />
          <meta
            property="og:url"
            content={
              setting?.meta_url || "https://meshek-kirshner.co.il/"
            }
          />
          <meta
            property="og:image"
            content={
              setting?.meta_img ||
              "https://meshek-kirshner.co.il/_next/static/media/newlogo.c452bf06.svg"
            }
          />
        </Head>
        <body>
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
          <script src="https://cdn.enable.co.il/licenses/enable-L669sin2yb9r7u-1017-61528/init.js"></script>
        </body>
      </Html>
    );
  }
}

export default MyDocument;
