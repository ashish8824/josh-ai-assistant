export default function ChatInput({
  value,
  onChange,
  onSend,
}: {
  value: string;
  onChange: (val: string) => void;
  onSend: () => void;
}) {
  return (
    <div className="p-4 border-t flex gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSend()}
        placeholder="Ask Josh anything..."
        className="flex-1 rounded-md border p-2 outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <button
        onClick={onSend}
        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
      >
        Send
      </button>
    </div>
  );
}
