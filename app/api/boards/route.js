import connectMongoDB from "@/libs/mongodb";
import Board from "@/models/board";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { title, content, user, isProtected } = await request.json();
  await connectMongoDB();
  const pin = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0");
  await Board.create({ title, content, user, isProtected, pin });
  return NextResponse.json(
    { message: "Board created successfully" },
    { status: 201 }
  );
}

export async function GET(request) {
  await connectMongoDB();

  const uuid = request.headers.get("syncboard_uuid");
  console.log("UUID from Local Storage:", uuid);

  if (request.nextUrl.searchParams.get("id")) {
    const id = request.nextUrl.searchParams.get("id");
    const board = await Board.findById(id);
    if (!board) {
      return NextResponse.json({ message: "Board not found" }, { status: 404 });
    }

    if (uuid && uuid == board.user) {
      console.log("UUID matched:", uuid, board.user);
      return NextResponse.json({ board }, { status: 200 });
    }

    if (board.isProtected) {
      board.content =
        "This board is protected. Please enter the pin to copy the content.";
    }
    const boardWithoutPin = {
      _id: board._id,
      title: board.title,
      content: board.content,
      user: board.user,
      isProtected: board.isProtected,
      createdAt: board.createdAt,
      updatedAt: board.updatedAt,
    };
    return NextResponse.json({ board: boardWithoutPin });
  }

  const boards = await Board.find();
  if (!boards) {
    return NextResponse.json({ message: "No boards found" }, { status: 404 });
  }

  const boardsWithoutPin = boards.map((board) => {
    return {
      _id: board._id,
      title: board.title,
      content: board.content,
      user: board.user,
      pin: uuid === board.user ? board.pin : null,
      isProtected: board.isProtected,
      createdAt: board.createdAt,
      updatedAt: board.updatedAt,
    };
  });
  for (let i = 0; i < boards.length; i++) {
    if (boards[i].isProtected && boards[i].user !== uuid) {
      boardsWithoutPin[i].content =
        "This board is protected. Please enter the pin to copy the content.";
    } else {
      boardsWithoutPin[i].pin = boards[i].pin;
    }
  }
  return NextResponse.json({ boards: boardsWithoutPin }, { status: 200 });
}

export async function PUT(request) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json(
      { message: "Board ID is Not found" },
      { status: 404 }
    );
  }
  const { newTitle: title, newContent: content } = await request.json();
  await connectMongoDB();
  await Board.findByIdAndUpdate(id, { title, content });
  return NextResponse.json(
    { message: "Board updated successfully" },
    { status: 200 }
  );
}

export async function DELETE(request) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json(
      { message: "Board ID is required" },
      { status: 400 }
    );
  }
  await connectMongoDB();
  await Board.findByIdAndDelete(id);
  return NextResponse.json(
    { message: "Board deleted successfully" },
    { status: 200 }
  );
}
