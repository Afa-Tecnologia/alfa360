// components/ui/Spinner.tsx
 // Utilize o utilitário cn (classNames) do ShadCN

export default function Spinner() {
  return (
    <div className="relative w-12 h-12">
      <div className="absolute inset-0 flex items-center justify-center">
        <svg
          className="animate-spin h-12 w-12 text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="4"
            d="M4 12c0-4.418 3.582-8 8-8s8 3.582 8 8"
          ></path>
        </svg>
      </div>
    </div>
  );
}
