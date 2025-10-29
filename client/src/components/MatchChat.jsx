import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";

function MatchChat({ match, onSendMessage }) {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [match?.messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim() || sending) return;

    try {
      setSending(true);
      await onSendMessage(message);
      setMessage("");
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
    } finally {
      setSending(false);
    }
  };

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 1) return "Ahora";
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;

    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!match || !match.messages) {
    return null;
  }

  return (
    <div className="flex flex-col h-[500px] bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4">
        <h3 className="font-semibold text-lg">💬 Chat del Intercambio</h3>
        <p className="text-sm text-purple-100">
          Conversa con{" "}
          {match.requester._id === user.id
            ? match.requestedUser.username
            : match.requester.username}
        </p>
      </div>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-br from-gray-50 to-white"
      >
        {match.messages.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            <div className="text-4xl mb-3">💭</div>
            <p>No hay mensajes aún</p>
            <p className="text-sm">
              Inicia la conversación para coordinar el intercambio
            </p>
          </div>
        ) : (
          <>
            {match.messages.map((msg, index) => {
              const isOwnMessage = msg.sender._id === user.id;

              return (
                <div
                  key={msg._id || index}
                  className={`flex ${
                    isOwnMessage ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] ${
                      isOwnMessage
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                        : "bg-white border-2 border-gray-200 text-gray-900"
                    } rounded-2xl px-4 py-3 shadow-md`}
                  >
                    {!isOwnMessage && (
                      <p className="text-xs font-semibold mb-1 text-purple-600">
                        {msg.sender.username}
                      </p>
                    )}
                    <p className="text-sm whitespace-pre-wrap break-words">
                      {msg.content}
                    </p>
                    <div
                      className={`flex items-center gap-2 mt-1 text-xs ${
                        isOwnMessage ? "text-purple-100" : "text-gray-500"
                      }`}
                    >
                      <span>{formatMessageTime(msg.timestamp)}</span>
                      {isOwnMessage && <span>{msg.isRead ? "✓✓" : "✓"}</span>}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="border-t border-gray-200 p-4 bg-white"
      >
        <div className="flex gap-3">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Escribe un mensaje... (Enter para enviar, Shift+Enter para nueva línea)"
            className="flex-1 px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            rows="2"
            maxLength="1000"
            disabled={sending}
          ></textarea>
          <button
            type="submit"
            disabled={!message.trim() || sending}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? "⏳" : "📩"}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {message.length}/1000 caracteres
        </p>
      </form>
    </div>
  );
}

export default MatchChat;
