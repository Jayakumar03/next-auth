import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";
import nodemailer from "nodemailer";

const mailer = async ({ email, emailType, userId }: any) => {
  try {
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    switch (emailType) {
      case "VERIFY":
        await User.findByIdAndUpdate(userId, {
          verifyToken: hashedToken,
          verifyTokenExpiry: Date.now() + 3600000,
        });
        break;

      case "RESET":
        await User.findByIdAndUpdate(userId, {
          forgotToken: hashedToken,
          forgotTokenExpiry: Date.now() + 3600000,
        });
        break;

      default:
        break;
    }

    var transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "44ac05b9a2f6e4",
        pass: "06cb7dabd7f780",
      },
    });

    const mailOptions = {
      from: "Example@gmail.com",
      to: email,
      subject:
        emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html: `<p>Click <a href="
        http://localhost:3000/verifyemail?token=${hashedToken}">here</a> to ${
        emailType === "VERIFY" ? "verify your email" : "reset your password"
      }
        or copy and paste the link below in your browser. <br> ${
          process.env.DOMAIN
        }/verifyemail?token=${hashedToken}
        </p>`,
    };

    const mailresponse = await transport.sendMail(mailOptions);
    return mailresponse;
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Error in mailer",
      },
      { status: 400 }
    );
  }
};

export default mailer;
