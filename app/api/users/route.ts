import { NextResponse, NextRequest } from "next/server";
import User from "@/app/models/User";
import connectDB from "@/app/lib/db";
import { verifyToken } from "@/app/lib/auth";

// 取得所有User的資料
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return NextResponse.json(
      {
        success: false,
        message: "Authorization header is required",
      },
      {
        status: 401,
      }
    );
  }
  const token = authHeader.split(" ")[1];
  let user;
  try {
    user = verifyToken(token);
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: (err as Error).message,
      },
      {
        status: 401,
      }
    );
  }
  if (user.role !== "admin") {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  try {
    await connectDB();
    const users = await User.find();
    return NextResponse.json(
      {
        success: true,
        data: users,
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: (err as Error).message,
      },
      {
        status: 500,
      }
    );
  }
}

