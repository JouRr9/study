import "./globals.css";
import type { Metadata } from "next";

import Script from "next/script";

export const metadata: Metadata = {
  title: "Study for nextjs + typeScript + springBoot",
  description: "Next.js + TypeScript + Tailwind CSS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <Script
          src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false&libraries=services,clusterer`}
          strategy="beforeInteractive"
        />{children}</body>
    </html>
  );
}
