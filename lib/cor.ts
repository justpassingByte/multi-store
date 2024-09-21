// utils/cors.ts
export const setCorsHeaders = (response: Response) => {
    response.headers.set("Access-Control-Allow-Origin", "http://localhost:3000"); // Thay bằng origin của bạn
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return response;
  };
  