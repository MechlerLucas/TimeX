export function Input({ className = "", ...props }) {
  return (
    <input
      className={`border rounded-md px-3 py-2 w-full outline-none ${className}`}
      {...props}
    />
  );
}
