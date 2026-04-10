import Link from "next/link";
import { CloudOff } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[80vh] px-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-neutral-100 dark:bg-neutral-900 mb-8">
          <CloudOff className="w-12 h-12 text-neutral-400 dark:text-neutral-500" />
        </div>
        
        <h1 className="text-6xl font-extrabold text-neutral-900 dark:text-white tracking-tighter mb-4">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-neutral-700 dark:text-neutral-300 mb-4">
          Lost in the Cloud
        </h2>
        <p className="max-w-md mx-auto text-neutral-500 dark:text-neutral-400 mb-8">
          We looked everywhere, but it seems the page you are looking for has disconnected from the server or does not exist.
        </p>

        <Link 
          href="/" 
          className="inline-flex items-center justify-center px-8 py-4 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-xl font-bold hover:shadow-xl transform transition hover:-translate-y-1 active:translate-y-0"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
