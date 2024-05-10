import { ImageResponse } from "next/og";
import { APP_DESCRIPTION, APP_NAME } from "@/app_settings";
export const runtime = "edge";

export async function GET() {
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
          backgroundColor: "white",
          textAlign: "center",
        }}
      >
        <div tw=" flex flex-col text-center items-center ">
          <span tw="text-4xl font-bold">{APP_NAME}</span>
          <span tw="mt-4 text-lg">{APP_DESCRIPTION}</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
