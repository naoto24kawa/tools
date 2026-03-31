import type { AppInfo } from '@utils/apps';
import { CATEGORY_COLORS } from '@utils/apps';

interface ToolCardProps {
  app: AppInfo;
}

export function ToolCard({ app }: ToolCardProps) {
  return (
    <a
      href={app.path + '/'}
      className="group block rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg hover:border-gray-300"
    >
      <div className="flex items-start gap-3 p-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xl group-hover:bg-gray-200 transition-colors">
          {app.icon}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-gray-900 truncate">
            {app.displayName}
          </h3>
          <p className="mt-0.5 text-xs text-gray-500 line-clamp-2">
            {app.description}
          </p>
        </div>
      </div>
      <div className="border-t border-gray-100 px-4 py-2">
        <span
          className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium text-white ${CATEGORY_COLORS[app.category]}`}
        >
          {app.category}
        </span>
      </div>
    </a>
  );
}
