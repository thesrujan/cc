"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

const CATEGORIES = ["All", "Lighting", "Furniture", "Accessories", "Audio"];

export default function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentCategory = searchParams.get("category") || "All";
  const currentSearch = searchParams.get("search") || "";
  
  const [searchValue, setSearchValue] = useState(currentSearch);

  // Debounced search could go here, but a simple on blur or Enter form submission works too
  const updateQueryParams = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "All") {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const handleCategoryClick = (category: string) => {
    updateQueryParams("category", category);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateQueryParams("search", searchValue);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-neutral-50 dark:bg-neutral-900 p-4 rounded-xl mb-12 border border-neutral-200 dark:border-neutral-800">
      <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryClick(cat)}
            className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
              currentCategory === cat
                ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-lg"
                : "bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700 border border-neutral-100 dark:border-neutral-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      
      <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-72">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <input 
          type="text" 
          placeholder="Search items..." 
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-sm"
        />
      </form>
    </div>
  );
}
