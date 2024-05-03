import { useState, useEffect } from "react";
import { BsSend } from "react-icons/bs";
import useSendMessage from "../../hooks/useSendMessage";
import io from "socket.io-client";
import useConversation from "../../zustand/useConversation";
const socket = io("http://localhost:5000");
const MessageInput = () => {
  const [message, setmessage] = useState("");
  const { loading, sendMessage } = useSendMessage();
  const [typing, settyping] = useState(false);
  const { messages, selectedConversation } = useConversation();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message) {
      return;
    }
    await sendMessage(message);
    setmessage("");
  };
  const [typingTimeout, settypingTimeout] = useState(null);

  function handleInput(e) {
    setmessage(e.target.value);
    socket.emit("typing-started");
    if (typingTimeout) clearTimeout(typingTimeout);
    settypingTimeout(
      setTimeout(() => {
        socket.emit("typing-stopped");
      }, 1000)
    );
  }
  useEffect(() => {
    if (!socket) return;
    const handleTypingStarted = () => settyping(true);
    const handleTypingStopped = () => settyping(false);
    socket.on("typing-started-from-server", handleTypingStarted);
    socket.on("typing-stopped-from-server", handleTypingStopped);
  }, [socket]);
  return (
    <form className="px-4 my-3" onSubmit={handleSubmit}>
      {typing && <div>Typing...</div>}
      <div className="w-full relative">
        <input
          type="text"
          className="border text-sm rounded-lg block w-full p-2.5  bg-gray-700 border-gray-600 text-white"
          placeholder="Send a message"
          value={message}
          onChange={handleInput}
        />
        <button
          type="submit"
          className="absolute inset-y-0 end-0 flex items-center pe-3"
        >
          {loading ? (
            <div className="loading loading-spinner"></div>
          ) : (
            <BsSend />
          )}
        </button>
      </div>
    </form>
  );
};
export default MessageInput;
