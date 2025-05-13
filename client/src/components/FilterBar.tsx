import { useState } from 'react';
import { projectCategories, sortOptions } from '@/lib/utils';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FilterBarProps {
  onCategoryChange: (category: string) => void;
  onSortChange: (sort: string) => void;
  onSearchChange: (search: string) => void;
}

export default function FilterBar({ 
  onCategoryChange, 
  onSortChange, 
  onSearchChange 
}: FilterBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSort, setSelectedSort] = useState('newest');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    onCategoryChange(category);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSort(e.target.value);
    onSortChange(e.target.value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearchChange(value);
  };

  return (
    <div className="sticky top-0 z-40 bg-cyber-black/80 backdrop-blur-md py-4 border-b border-neon-cyan/20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-4">
          {/* Category tabs */}
          <div className="flex justify-center overflow-x-auto scrollbar-hidden">
            <div className="inline-flex space-x-1 py-2">
              {projectCategories.map((category, index) => (
                <motion.button
                  key={category.value}
                  onClick={() => handleCategoryClick(category.value)}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={cn(
                    "relative px-4 py-2 font-orbitron text-sm whitespace-nowrap transition-all duration-300",
                    selectedCategory === category.value 
                      ? "text-neon-cyan" 
                      : "text-white/60 hover:text-white"
                  )}
                >
                  {category.label}
                  {selectedCategory === category.value && (
                    <motion.div 
                      className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-neon-cyan"
                      layoutId="categoryIndicator"
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>
          
          {/* Filter Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="font-orbitron text-xs text-white/60">SORT:</div>
              <select
                id="sort-filter"
                value={selectedSort}
                className="bg-cyber-black/50 border border-neon-cyan/30 text-cyber-text px-3 py-1.5 rounded-sm text-xs focus:border-neon-cyan focus:outline-none transition-colors"
                onChange={handleSortChange}
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center">
              <div className={cn(
                "relative transition-all duration-300 border rounded-sm",
                isSearchFocused 
                  ? "border-neon-cyan bg-cyber-black/50 w-64" 
                  : "border-white/20 bg-cyber-black/30 w-48"
              )}>
                <input
                  type="text"
                  placeholder="SEARCH PROJECTS..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="bg-transparent text-cyber-text pl-10 pr-4 py-2 text-xs w-full focus:outline-none"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={cn(
                    "h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors",
                    isSearchFocused ? "text-neon-cyan" : "text-white/60"
                  )}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
