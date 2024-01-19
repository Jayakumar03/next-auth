import connect from "@/app/dbConfig/dbConfig";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse, NextRequest } from "next/server";

connect();

export async function POST(request: NextResponse) {
  try {
    const { email, password } = await request.json();

    if (!email || !password)
      return NextResponse.json({
        message: "All fields are required",
        success: false,
      });

    const user = await User.findOne({ email });
    console.log(user);

    if (!user)
      return NextResponse.json({
        message: "Could not find user for spcified email id",
        success: false,
      });

    const validPassword = await bcryptjs.compare(password, user.password);

    if (!validPassword) {
      return NextResponse.json({
        message: "Invalid Password",
        success: false,
      });
    }

    // Generating jwt token

    const tokenData = {
      id: user._id,
      email: user.email,
      userName: user.userName,
    };

    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: "1d",
    });

    // Attaching cookie with response

    const response = NextResponse.json({
      message: "Login successfull",
      success: true,
    });

    response.cookies.set("token", token, { httpOnly: true });

    return response;
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json({
      error: error.message,
      success: false,
    });
  }
}
