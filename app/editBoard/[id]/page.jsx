"use client";
import Error from "@/components/Error";
import Success from "@/components/Success";
import React, { useEffect, useState } from "react";

export default function editBoard({ params }) {
  const { id } = React.use(params);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function getBoard() {
      try {
        const board = await fetch(`/api/boards?id=${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "syncboard_uuid": localStorage.getItem("syncboard_uuid"),
          },
          cache: "no-cache",
        });
        const boardData = await board.json();

        if (!board.ok) {
          setError("Failed to get board");
          return;
        }

        if (boardData) {
          setTitle(boardData.board.title);
          setContent(boardData.board.content);
        }
      } catch (error) {
        console.error(error);
        setError("Failed to get board. Try Again");
      }
    }
    getBoard();
  }, [id]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      setError("Please fill in all fields");
      return;
    }
    if (content.length > 1000) {
      setError("Content is too long");
      return;
    }

    try {
      const res = await fetch(`/api/boards?id=${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newTitle: title,
          newContent: content,
        }),
      });

      if (!res.ok) {
        setError("Failed to update board");
        return;
      }

      if (res.ok) {
        setSuccess("Board Updated Successfully");
      }
    } catch (error) {
      console.error;
      setError("Failed to update board. Try Again");
    }
  };

  setTimeout(() => {
    setError("");
    setSuccess("");
  }, 8000);

  return (
    <section className="max-w-[1200px] mx-auto mt-8">
      <h2 className="text-4xl font-bold flex items-center gap-4 text-slate-900">
        Edit Board
      </h2>
      <form onSubmit={handleFormSubmit}>
        <div className="mt-8">
          <label
            htmlFor="boardContent"
            className="text-slate-900 font-semibold"
          >
            Board Content <span className="text-sm font-normal">({content.length} of 1000 characters)</span>
          </label>
          <textarea
            id="boardContent"
            onChange={(e) => setContent(e.target.value)}
            value={content}
            placeholder="Enter board content"
            className="w-full border-2 border-slate-300 p-2 rounded-md mt-2"
            rows={15}
          />
        </div>
        <div className="mt-8">
          <label htmlFor="boardName" className="text-slate-900 font-semibold">
            Board Name
          </label>
          <input
            type="text"
            id="boardName"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            placeholder="Enter board name"
            className="w-full border-2 border-slate-300 p-2 rounded-md mt-2"
          />
        </div>
        <div className="mt-8">
          <button
            type="submit"
            className="bg-purple-500 text-slate-50 px-4 py-2 rounded-md hover:bg-purple-600 transition-all"
          >
            Update Board
          </button>
        </div>
      </form>
      {error === "" ? null : <Error error={error} />}
      {success === "" ? null : <Success success={success} />}
    </section>
  );
}
