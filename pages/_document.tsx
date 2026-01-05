import Document, {
  DocumentInitialProps,
  Head,
  Html,
  Main,
  NextScript
} from "next/document";

import { CookieStore } from "@/lib/types";

interface DocumentProps extends DocumentInitialProps {
  cookies: CookieStore;
}

function onLoad() {
  function parseCookies(cookieString?: string): Record<string, string> {
    const res: Record<string, string> = {};

    if (!cookieString) return res;

    const cookie = cookieString.split(";");

    for (let raw of cookie) {
      raw = raw.trim();
      if (raw.length === 0) continue;

      // eslint-disable-next-line prefer-const
      let [key, val] = raw.split("=");

      try {
        val = decodeURIComponent(val);
      } catch {
        // Ignore decode errors
      }

      if (key) {
        res[key] = val;
      }
    }

    return res;
  }

  // @ts-ignore
  function isValidColorScheme(colorScheme) {
    return ["light", "dark"].includes(colorScheme);
  }

  try {
    const cookies = parseCookies(document.cookie);
    document.documentElement.dataset.theme = cookies.bkk_theme;

    let colorScheme;

    if (isValidColorScheme(cookies.bkk_color_scheme)) {
      colorScheme = cookies.bkk_color_scheme;
    } else {
      colorScheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }

    document.documentElement.dataset.colorScheme = colorScheme;
  } catch {
    // No-op
  }
}

const execOnLoad = `(function() { (${onLoad.toString()}())})()`;

class MyDocument extends Document<{ props: DocumentProps }> {
  render() {
    return (
      <Html>
        <Head>
          <script
            dangerouslySetInnerHTML={{
              __html: `${execOnLoad}`
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
