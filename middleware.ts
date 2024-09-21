import { authMiddleware } from "@clerk/nextjs/server";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

// Middleware xác thực
export const clerkMiddleware = authMiddleware({
  publicRoutes: ["/api/:path*"],
});

export default async function middleware(req: NextRequest,event: NextFetchEvent) {
  // Gọi middleware xác thực
  const response = await clerkMiddleware(req,event);

  // Nếu đã xử lý rồi, trả về phản hồi
  if (response) {
    return response;
  }

  // Thêm headers CORS
  const res = NextResponse.next();
  res.headers.set("Access-Control-Allow-Origin", "http://localhost:3000");
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type");

  // Xử lý các yêu cầu OPTIONS
  if (req.method === "OPTIONS") {
    return new NextResponse(null, { status: 204, headers: res.headers });
  }

  return res;
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
