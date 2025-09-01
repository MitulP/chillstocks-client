export function Button({ children, className, ...props }) {
  return (
    <button {...props} className={`px-6 py-3 rounded-xl font-medium transition ${className}`}>
      {children}
    </button>
  );
}
