"use client";
import Link from "next/link";
import React, { useState, useEffect, use } from "react";
import {
  AiFillEdit,
  AiFillDelete,
  AiFillCopy,
  AiOutlineShareAlt,
} from "react-icons/ai";
import PopUp from "./PopUp";
import Success from "./Success";
import Error from "./Error";
import { useRouter } from "next/navigation";
import { getLocalStorageUuid } from "@/app/identification";

export default function BoardList({ id, title, content, updated, user, isProtected, password="" }) {
  const date = new Date(updated);
  const updatedDate = date.toDateString();
  const updatedTime = date.toLocaleTimeString();
  const updatedFullDate = `${updatedDate} at ${updatedTime}`;

  const router = useRouter();

  const [message, setMessage] = useState("");
  const [pin, setPin] = useState("");
  const [showPIN, setShowPIN] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [clientUuid, setClientUuid] = useState("");
  
  useEffect(() => {
    setClientUuid(getLocalStorageUuid());
  }, []);

  const handleCopy = async (content) => {
    setShowPIN(false); 

    if (isProtected) {
      await fetch(`/api/protected`, {
        method: "POST",
        body: JSON.stringify({
          id: id,
          pin: pin
        }),
        },).then((res) => {
          if (!res.ok) {
            setError("Invalid PIN");
            return;
          } else { 
            res.json().then(data => {
              navigator.clipboard.writeText(data.content);
              setMessage("Content copied to clipboard");
            });
          }
        }
      );
    } else {
      navigator.clipboard.writeText(content);
    }

    if (!navigator.clipboard) {
      setMessage("Copy to clipboard not supported");
      return;
    }
  };

  const handleShare = (id) => {
    const url = window.location.origin + "/";
    navigator.clipboard.writeText(`${url}#${id}`);
    if (!navigator.clipboard) {
      setMessage("Share not supported");
      return;
    }
    setMessage("Link copied to clipboard");
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/boards?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        setError("Failed to delete board");
        return;
      }
      if(res.status === 404) {
        setError("Board not found");
        return;
      }
      if(res.status){
        setSuccess("Board deleted successfully");
        router.refresh();
        return;
      }
      setError("Failed to delete board");
    } catch (error) {
      setError("Failed to delete board");
      console.error(error);
    }
  }

  setTimeout(() => {
    setMessage("");
    setSuccess("");
    setError("");
  }, 5000);

  return (
    <section className="max-w-[1200px] mx-auto mt-8" id={id}>
      {showPIN && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Protected Content</h3>
            <p className="text-gray-700 mb-4">
              This board is protected. Please enter the PIN to copy the content.
            </p>
            <input
              type="password"
              placeholder="Enter PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
            />
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => setShowPIN(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleCopy(content)}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {success && <Success success={success} />}
      {error && <Error error={error} />}
      <div className="relative">
        <div className="bg-slate-50 border-t-2 border-purple-500 p-4 rounded-md shadow-md">
          <div className="flex justify-between items-center gap-4 flex-wrap">
            <h2 className="text-2xl font-semibold text-slate-900">
              {title.slice(0, 20)} {user == clientUuid && clientUuid && <span className="text-sm text-gray-500"> (You)</span>}
            </h2>
            <p className="text-sm text-gray-500">{password}</p>
            <div className="flex gap-2">
              <button 
                title="Click to Copy" 
                onClick={() => isProtected ? setShowPIN(true) : handleCopy(content)}
              >
                <AiFillCopy
                  size={38}
                  className="hover:text-purple-90 hover:scale-110 hover:animate-pulse text-purple-600"
                />
              </button>
              <button title="Click to Share" onClick={() => handleShare(id)}>
                <AiOutlineShareAlt size={38} className="hover:scale-110" />
              </button>
              {user == clientUuid && clientUuid && <Link href={`/editBoard/${id}`}>
                <AiFillEdit size={32} className="hover:text-yellow-500" />
              </Link>}
            </div>
          </div>
          <div className="flex justify-between items-end mt-8">
            <div className="flex gap-4">
              {user == clientUuid && clientUuid && <> <Link href={`/editBoard/${id}`}>
                <AiFillEdit size={32} className="hover:text-yellow-500" />
              </Link>
              <button title="Double Click to Delete" onDoubleClick={() => handleDelete(id)}>
                <AiFillDelete size={32} className="hover:text-red-500" />
              </button></>}
            </div>
            <p className="text-xs text-end">{updatedFullDate}</p>
          </div>
        </div>
        {message && <PopUp message={message} />}
      </div>
    </section>
  );
}
