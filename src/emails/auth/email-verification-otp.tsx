import React from "react";

interface EmailTemplateProps {
  link: string;
}

export function EmailVerificationOTPTemplate({ otpCode }: { otpCode: string }) {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        fontSize: "16px",
        color: "#333",
        lineHeight: "1.5",
        padding: "20px",
        backgroundColor: "#f9f9f9",
        border: "1px solid #ddd",
        borderRadius: "5px",
      }}
    >
      <h1 style={{ color: "#111", fontSize: "20px" }}>Verify Your Email</h1>
      <p>Thank you for signing up at <strong>{process.env.APP_NAME}</strong>.</p>
      <p>Here is your OTP verification code:</p>
      <div
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          margin: "20px 0",
          textAlign: "start",
          color: "#111",
        }}
      >
        {otpCode}
      </div>
      <p>
        This code is valid for the next <strong>10 minutes</strong>. If you did not request this, please ignore this email.
      </p>
      <p>Thank you,</p>
      <p>The {process.env.APP_NAME} Team</p>
    </div>
  );
}
