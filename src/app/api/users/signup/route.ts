import connect from "@/app/dbConfig/dbConfig"; // Databse connection
import User from "@/models/userModel"; // UserSchema
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";

connect();

export async function POST(request: NextRequest) {
  try {
    const { userName, email, password } = await request.json();

    if (!userName || !email || !password)
    return NextResponse.json({
      message: "All fields are required ",
      success: false,
    });

    const isUserAlreadyExist = await User.findOne({ email: email });

    if (isUserAlreadyExist)
      return NextResponse.json({
        message: "User already exist",
        success: false,
      });

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const user = await User.create({
      userName: userName,
      email: email,
      password: hashedPassword,
    });

    console.log(user);

    if (!user)
      return NextResponse.json({
        message: "Error while creating user",
        success: false,
      });

    return NextResponse.json({
      message: "User created successfully",
      success: true,
      user,
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      success: false,
    });
  }
}
