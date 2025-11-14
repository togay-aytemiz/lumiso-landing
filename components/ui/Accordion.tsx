import React, { useId, useMemo, useState } from 'react';

export interface AccordionEntry {
  title: React.ReactNode;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionEntry[];
  allowMultiple?: boolean;
  defaultOpenIndices?: number[];
  className?: string;
  itemClassName?: string;
}

const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  defaultOpenIndices = [],
  className = '',
  itemClassName = '',
}) => {
  const [openIndices, setOpenIndices] = useState<Set<number>>(
    () => new Set(defaultOpenIndices)
  );
  const baseId = useId();

  const toggleItem = (index: number) => {
    setOpenIndices(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        if (!allowMultiple) {
          next.clear();
        }
        next.add(index);
      }
      return next;
    });
  };

  const entries = useMemo(
    () =>
      items.map((item, index) => ({
        ...item,
        index,
        headerId: `${baseId}-accordion-header-${index}`,
        panelId: `${baseId}-accordion-panel-${index}`,
      })),
    [items, baseId]
  );

  return (
    <div className={className}>
      {entries.map(({ title, content, index, headerId, panelId }) => {
        const isOpen = openIndices.has(index);
        return (
          <div
            key={index}
            className={[
              'border-b border-slate-200 dark:border-slate-700/50 py-6',
              itemClassName,
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <h3 className="text-lg font-semibold m-0 text-slate-800 dark:text-slate-100">
              <button
                type="button"
                onClick={() => toggleItem(index)}
                className="w-full flex justify-between items-center text-left focus:outline-none focus-visible:ring focus-visible:ring-brand-teal-500/50 rounded-md"
                id={headerId}
                aria-controls={panelId}
                aria-expanded={isOpen}
              >
                <span className="pr-4">{title}</span>
                <span
                  className={`transform transition-transform duration-300 flex-shrink-0 ${
                    isOpen ? '' : ''
                  }`}
                >
                  {isOpen ? (
                    <svg
                      className="w-6 h-6 text-brand-teal-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M20 12H4"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-6 h-6 text-slate-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  )}
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={headerId}
              className="grid overflow-hidden transition-all duration-500 ease-in-out text-slate-600 dark:text-slate-300"
              style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
            >
              <div className="min-h-0">
                <div className="pt-4">{content}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;
