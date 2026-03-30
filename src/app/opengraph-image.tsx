import { ImageResponse } from "next/og";
import { siteName } from "@/lib/site";

export const alt = `${siteName} — Full Stack Web Developer (MERN)`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(145deg, #ffffff 0%, #f5f5f5 45%, #eef0ff 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: 48,
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: "#000000",
              letterSpacing: -0.02,
              lineHeight: 1.05,
            }}
          >
            {siteName}
          </div>
          <div
            style={{
              marginTop: 20,
              fontSize: 32,
              fontWeight: 600,
              color: "#5D5FEF",
            }}
          >
            Full Stack Web Developer (MERN)
          </div>
          <div
            style={{
              marginTop: 16,
              fontSize: 22,
              fontWeight: 400,
              color: "rgba(0,0,0,0.45)",
            }}
          >
            Sylhet, Bangladesh
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
