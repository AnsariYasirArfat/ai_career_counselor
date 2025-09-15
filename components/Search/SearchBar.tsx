import { Search, X } from "lucide-react";
import SpinnerLoader from "@/components/common/SpinnerLoader";

interface SearchBarProps {
  value: string;
  loading: boolean;
  onChange: (v: string) => void;
  onClear: () => void;
}

export default function SearchBar({ value, loading, onChange, onClear }: SearchBarProps) {
    
  return (
    <div className="relative mb-8">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
        <Search size={20} />
      </span>
      <input
        type="text"
        className="w-full pl-10 pr-10 py-3 rounded-full bg-transparent border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-oration-orange transition"
        placeholder="Search for chats"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <span className="absolute right-3 top-1/2 -translate-y-1/2">
        {loading ? (
          <SpinnerLoader className="w-5 h-5 text-zinc-400" />
        ) : value ? (
          <button className="text-zinc-400 hover:text-zinc-200" onClick={onClear}>
            <X size={20} />
          </button>
        ) : null}
      </span>
    </div>
  );
}
