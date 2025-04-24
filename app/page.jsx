"use client";

import BoardList from "@/components/BoardList";
import { AiFillAppstore } from "react-icons/ai";
import { getLocalStorageUuid } from "@/app/identification";
import { useEffect, useState } from "react";

export default function Home() {
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    const fetchBoards = async () => {
      const uuid = getLocalStorageUuid(); // Retrieve UUID on the client
      try {
        const response = await fetch(`/api/boards`, {
          cache: "no-cache",
          headers: {
            "syncboard_uuid": uuid,
          },
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch boards");
        }

        const data = await response.json();
        console.log(data.boards);
        setBoards(data.boards);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBoards();
  }, []);

  return (
    <div className="max-w-[1200px] mx-auto mt-8">
      <h1 className="text-4xl font-bold flex items-center gap-4 text-slate-900">
        <AiFillAppstore />
        All Sync Boards
      </h1>
      {boards.reverse().map((board) => {
        return (
          <BoardList
            key={board._id}
            id={board._id}
            title={board.title}
            content={board.content}
            updated={board.updatedAt}
            user={board.user}
            isProtected={board.isProtected}
            password={board.pin}
          />
        );
      })}
    </div>
  );
}
