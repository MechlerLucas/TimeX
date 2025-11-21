export function Button({ className = "", ...props }) {
  return (
    <button
      className={
        "inline-flex items-center justify-center font-medium transition " +
        className
      }
      {...props}
    />
  );
}

