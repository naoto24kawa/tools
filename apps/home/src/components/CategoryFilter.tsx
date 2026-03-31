import type { AppCategory } from '@utils/apps';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '@utils/apps';

interface CategoryFilterProps {
  categories: AppCategory[];
  selected: AppCategory | null;
  counts: Record<AppCategory, number>;
  onSelect: (category: AppCategory | null) => void;
}

export function CategoryFilter({ categories, selected, counts, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
          selected === null
            ? 'bg-gray-900 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          type="button"
          onClick={() => onSelect(cat === selected ? null : cat)}
          className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
            cat === selected
              ? `${CATEGORY_COLORS[cat]} text-white`
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {CATEGORY_ICONS[cat]} {cat}
          <span className="ml-1 text-xs opacity-70">({counts[cat]})</span>
        </button>
      ))}
    </div>
  );
}
