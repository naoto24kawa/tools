import { useMemo, useState } from 'react';
import { CategoryFilter } from './components/CategoryFilter';
import { SearchBar } from './components/SearchBar';
import { ToolCard } from './components/ToolCard';
import type { AppCategory } from './utils/apps';
import { APPS, CATEGORY_ICONS } from './utils/apps';

const CATEGORIES = Object.keys(CATEGORY_ICONS) as AppCategory[];

const CATEGORY_COUNTS = CATEGORIES.reduce(
  (acc, cat) => {
    acc[cat] = APPS.filter((a) => a.category === cat).length;
    return acc;
  },
  {} as Record<AppCategory, number>,
);

export default function App() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AppCategory | null>(null);

  const filtered = useMemo(() => {
    let result = APPS;

    if (selectedCategory) {
      result = result.filter((a) => a.category === selectedCategory);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.displayName.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q),
      );
    }

    return result;
  }, [search, selectedCategory]);

  const grouped = useMemo(() => {
    const map = new Map<AppCategory, typeof APPS>();
    for (const app of filtered) {
      const list = map.get(app.category) ?? [];
      list.push(app);
      map.set(app.category, list);
    }
    return map;
  }, [filtered]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🛠</span>
              <h1 className="text-xl font-bold text-gray-900">Elchika Tools</h1>
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                {APPS.length}
              </span>
            </div>
            <p className="hidden text-sm text-emerald-700 sm:block">
              🔒 すべてブラウザ内で完結
            </p>
          </div>
          <div className="mt-3">
            <SearchBar
              value={search}
              onChange={setSearch}
              resultCount={filtered.length}
              totalCount={APPS.length}
            />
          </div>
          <div className="mt-3 overflow-x-auto pb-1">
            <CategoryFilter
              categories={CATEGORIES}
              selected={selectedCategory}
              counts={CATEGORY_COUNTS}
              onSelect={setSelectedCategory}
            />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-lg text-gray-600">No tools found</p>
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setSelectedCategory(null);
              }}
              className="mt-2 text-sm text-blue-500 hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {CATEGORIES.filter((cat) => grouped.has(cat)).map((cat) => (
              <section key={cat}>
                <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-gray-700">
                  <span>{CATEGORY_ICONS[cat]}</span>
                  {cat}
                  <span className="text-sm font-normal text-gray-500">
                    ({grouped.get(cat)!.length})
                  </span>
                </h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {grouped.get(cat)!.map((app) => (
                    <ToolCard key={app.path} app={app} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-4 text-center text-xs text-gray-600">
        Elchika Tools - All processing happens in your browser.
      </footer>
    </div>
  );
}
