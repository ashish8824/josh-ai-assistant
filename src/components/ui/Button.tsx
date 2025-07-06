export function Button({
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition ${className}`}
      {...props}
    />
  );
}
