"use client";
import Error from "@/components/Error";
import Success from "@/components/Success";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { AiTwotoneThunderbolt } from "react-icons/ai";
import { getLocalStorageUuid } from "@/app/identification";

export default function addNewBoard() {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [isProtected, setIsProtected] = useState(false);
  const [success, setSuccess] = useState("");

  const router = useRouter();

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

    if (title.length > 20) {
      setError("Title is too long");
      return;
    }

    try {
      const res = await fetch(`api/boards`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "syncboard_uuid": getLocalStorageUuid(),
        },
        body: JSON.stringify({
          title,
          content,
          isProtected,
          user: getLocalStorageUuid(),
        }),
      });

      if (!res.ok) {
        setError("Failed to add board");
        return;
      }

      if (res.ok) {
        router.push("/addNewBoard");
        setSuccess("Board Created Successfully");
        setTitle("");
        setContent("");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    let autoTitle = content.slice(0, 20);
    setTitle(autoTitle);
  })

  const handleTextAreaChange = (e) => {
    setContent(e.target.value);
    if (e.target.value.length < 20) {
      setTitle(e.target.value);
    }
    setTitle(e.target.value.slice(0, 20));
  };

  const handlePasteSubmit = () => {
    if(!navigator.clipboard) {
      setError("Clipboard API not supported");
      return;
    }
    navigator.clipboard.readText().then((text) => {
      setContent(text);
    });
  };

  setTimeout(() => {
    setError("");
  }, 8000);

  setTimeout(() => {
    setSuccess("");
  }, 8000);

  return (
    <section className="max-w-[1200px] mx-auto mt-8">
      <h2 className="text-4xl font-bold flex items-center gap-4 text-slate-900 mb-6">
        Add New Board
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
            placeholder="Enter board content"
            className="w-full border-2 border-slate-300 p-2 rounded-md mt-2"
            onChange={(e) => handleTextAreaChange(e)}
            value={content}
            rows={15}
          />
        </div>
        <div>
          <label htmlFor="boardName" className="text-slate-900 font-semibold">
            Board Name
          </label>
          <input
            type="text"
            id="boardName"
            placeholder="Enter board name"
            className="w-full border-2 border-slate-300 p-2 rounded-md mt-2"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
        </div>

        <div className="flex items-center gap-2 mt-4">
          <input
            type="checkbox"
            id="isProtected"
            className="w-4 h-4 border-2 border-slate-300 rounded-md"
            onChange={(e) => setIsProtected(e.target.checked)}
          />
          <label htmlFor="isProtected" className="text-slate-900 font-semibold">
            Is Protected
          </label>
        </div>

        <div className="flex gap-2 mt-4">
          <button
            type="submit"
            className="bg-purple-500 text-slate-50 px-4 py-2 rounded-md hover:bg-purple-600 transition-all"
          >
            Add Board
          </button>
          <button
            onClick={() => handlePasteSubmit()}
            type="button"
            className="bg-yellow-500 animate-pulse flex gap-2 items-center text-slate-50 px-4 py-2 rounded-md hover:bg-yellow-600 transition-all"
          >
            <AiTwotoneThunderbolt /> <span>Paste Content</span>
          </button>
        </div>
      </form>
      {error === "" ? null : <Error error={error} />}
      {success === "" ? null : <Success success={success} />}
    </section>
  );
}
