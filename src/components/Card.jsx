export function Card({ children, className }) {
  return <div className={`bg-white shadow-md border border-gray-200 rounded-xl ${className}`}>{children}</div>;
}
