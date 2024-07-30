import SettingServices from "@services/SettingServices";
import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);

    // Fetch general metadata from backend API
    const setting = await SettingServices.getStoreSeoSetting();

    return { ...initialProps, setting };
  }

  render() {
    const setting = this.props.setting;
    return (
      <Html lang="he" dir="rtl">
        <Head>
          <link rel="icon" href={setting?.favicon || "/favicon.png"} />
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
            content={setting?.meta_keywords || "ecommenrce online store"}
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
          {/* <script>
            {(function (h, o, t, j, a, r) {
              h.hj = h.hj || function () { (h.hj.q = h.hj.q || []).push(arguments) };
              h._hjSettings = { hjid: 5076708, hjsv: 6 };
              a = o.getElementsByTagName('head')[0];
              r = o.createElement('script'); r.async = 1;
              r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
              a.appendChild(r);
            })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=')};
          </script> */}
        </Head>
        <body>
          <Main />
          <NextScript />
          <script src="https://cdn.enable.co.il/licenses/enable-L669sin2yb9r7u-1017-61528/init.js"></script>
        </body>
      </Html>
    );
  }
}

export default MyDocument;
