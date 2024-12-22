const fs = require("fs");
import { NextResponse } from "next/server";
export async function POST(request){
    const {token,user} = await request.json();
    if(token){
        const name = token.split('|').slice(-1).join("");
        const path = process.cwd() + "/session/" + name;
        fs.writeFileSync(path, JSON.stringify(user));
    }
   
    return NextResponse.json({
        success: true,
    });
}

export async function GET(request) {
    // Thiết lập giá trị mặc định cho token
    const token = request.headers.get("token") || "default_token_value"; // Giá trị mặc định nếu không có token

    // Chỉ xử lý nếu token không phải là giá trị mặc định
    if (token !== "default_token_value") {
        const name = token.split('|').slice(-1).join("");
        const path = process.cwd() + "/session/" + name;

        try {
            // Kiểm tra nếu file tồn tại trước khi cố gắng đọc
            if (fs.existsSync(path)) {
                const user = JSON.parse(fs.readFileSync(path));
                return NextResponse.json({
                    user,
                });
            } else {
                return NextResponse.json({
                    user: null,
                    error: "Session file not found."
                });
            }
        } catch (error) {
            return NextResponse.json({
                user: null,
                error: error.message // Trả về lỗi nếu có
            });
        }
    }

    // Nếu không có token, trả về user null
    return NextResponse.json({
        user: null,
    });
}

