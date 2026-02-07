import { ChangeEvent, memo } from 'react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}


function SearchInputComponent({ value, onChange, placeholder = 'جستجو بر اساس نام یا ایمیل...' }: SearchInputProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="w-full" role="search">
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   transition-all duration-200"
        aria-label="جستجوی کاربران"
      />
    </div>
  );
}

export const SearchInput = memo(SearchInputComponent);

