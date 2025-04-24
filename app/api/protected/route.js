import connectMongoDB from "@/libs/mongodb";
import Board from "@/models/board";
import { NextResponse } from "next/server";


export async function POST(request) {
    const { id, pin } = await request.json();

  
    if (!id || !pin) {
      return NextResponse.json({ message: "Board ID and PIN are required" }, { status: 400 });
    }
  
    await connectMongoDB();
    const board = await Board.findById(id);
  
    if (!board) {
      return NextResponse.json({ message: "Board not found" }, { status: 404 });
    }
  
    if (!board.isProtected || board.pin !== pin) {
      return NextResponse.json({ message: "Invalid PIN or board is not protected" }, { status: 403 });
    }
    console.log("content: ", board.content);
    return NextResponse.json({ content: board.content }, { status: 200 });
  }