"use server";
import { createHmac } from "crypto";
import { db } from "../db";
import bcrypt from "bcrypt";
import { v4 } from "uuid";
import { Resend } from "resend";
import { env } from "@/env";
import { EmailVerificationLinkTemplate } from "@/emails/auth/email-verification-link";
import { APP_NAME } from "@/app-settings";
import { PasswordResetLinkTemplate } from "@/emails/auth/password-reset-link";
import { acceptWorkspaceInvite } from "./workspace.action";
const resend = new Resend(env.RESEND_API_KEY);

export const getUserByEmail = async (email: string) => {
  const existingUser = await db.user.findFirst({
    where: {
      email,
    },
  });

  return existingUser;
};
export const getUserById = async (id: string) => {
    const existingUser = await db.user.findFirst({
      where: {
        id,
      },
    });
  
    return existingUser;
  };

export const generateVerificationToken = async (email: string) => {
    const existingVerificationToken = await db.verificationToken.findFirst({where: {identifier: email}});
    if(existingVerificationToken){
        await db.verificationToken.deleteMany({where: {identifier: email}});
    }
    const token = createHmac("sha256", email.toString() + v4()).digest("hex");
    // Create verification token and send email using resend
    const verificationToken = await db.verificationToken.create({
        data: {
            expires: new Date(Date.now() + 1000 * 60 * 60),
            token,
            identifier: email,
        },
    })

    return verificationToken;
}
export const generatePasswordResetToken = async (email: string) => {
    const existingPasswordResetToken = await db.passwordResetToken.findFirst({where: {identifier: email}});
    if(existingPasswordResetToken){
        await db.passwordResetToken.deleteMany({where: {identifier: email}});
    }
    const token = createHmac("sha256", email.toString() + v4()).digest("hex");
    // Create verification token and send email using resend
    const passwordResetToken = await db.passwordResetToken.create({
        data: {
            expires: new Date(Date.now() + 1000 * 60 * 60),
            token,
            identifier: email,
        },
    })

    return passwordResetToken;
}

export const registerUser = async (email: string, password: string, name: string, inviteToken?:string|null) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
        return {error: "User already exists"};
    }
    const user = await db.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
    });

    if(inviteToken){
        try {
            await acceptWorkspaceInvite(inviteToken, user.id);
        } catch (error) {  }
    }
    
    const verificationToken = await generateVerificationToken(email);

    // Send verification email
    await resend.emails.send({
        from: `${APP_NAME}<${env.EMAIL_FROM}>`,
        to: email,
        subject: `Verify your email at ${APP_NAME}`,
        react: EmailVerificationLinkTemplate({ link: `${env.NEXTAUTH_URL}/verify?token=${verificationToken.token}` }),
        html: ""
    })

    return {success: "Verification email sent!"};
    
}

export const forgotPassword = async (email: string) => {
    const existingUser = await getUserByEmail(email);
    if(!existingUser) return {error: "User not found"};
    const passwordResetToken = await generatePasswordResetToken(email);

    await resend.emails.send({
        from: `${APP_NAME}<${env.EMAIL_FROM}>`,
        to: email,
        subject: `Reset your password at ${APP_NAME}`,
        react: PasswordResetLinkTemplate({ link: `${env.NEXTAUTH_URL}/reset-password?token=${passwordResetToken.token}` }),
        html: ""
    })
    return {success: "Password Reset email sent!"};
}

export const resetPassword = async (token: string, password: string) => {
    const passwordResetToken = await db.passwordResetToken.findFirst({where: {token}});
    if(!passwordResetToken ||( passwordResetToken && passwordResetToken.expires < new Date())) return {error: "Invalid token or token expired! Check the email for the latest link."};
    const existingUser = await getUserByEmail(passwordResetToken.identifier);
    if(!existingUser) return {error: "Email does not exit!"};
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.user.update({where: {email: passwordResetToken.identifier}, data: {
        password: hashedPassword
    } })
    await db.passwordResetToken.delete({where: {token}});
    return { success: "Password reset successfully! Redirecting to login..." }
}

export const validateVerificationToken = async (token: string) => {
    const verificationToken = await db.verificationToken.findUnique({where: {token}});
    if(!verificationToken ||( verificationToken && verificationToken.expires < new Date())) return {error: true};

    await db.verificationToken.delete({where: {token}});

    await db.user.update({where: {email: verificationToken.identifier}, data: {
        emailVerified: new Date()
    } })

    return { success: true }
}
export const validatePasswordResetToken = async (token: string) => {
    const passwordResetToken = await db.passwordResetToken.findUnique({where: {token}});
    if(!passwordResetToken ||( passwordResetToken && passwordResetToken.expires < new Date())) return {error: true};
    return { success: true }
}

