import { ReactNode } from 'react';

interface Column {
  header: string;
  accessor: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: any) => ReactNode;
}

interface StatsTableProps {
  columns: Column[];
  data: any[];
  className?: string;
}

export function StatsTable({ columns, data, className = '' }: StatsTableProps) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full">
        <thead className="bg-gray-100 border-b-2 border-primary-500">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className={`px-4 py-3 text-sm font-semibold text-gray-700 ${
                  column.align === 'center'
                    ? 'text-center'
                    : column.align === 'right'
                    ? 'text-right'
                    : 'text-left'
                }`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b hover:bg-gray-50 transition-colors">
                {columns.map((column, colIndex) => {
                  const value = row[column.accessor];
                  return (
                    <td
                      key={colIndex}
                      className={`px-4 py-3 text-sm ${
                        column.align === 'center'
                          ? 'text-center'
                          : column.align === 'right'
                          ? 'text-right'
                          : 'text-left'
                      }`}
                    >
                      {column.render ? column.render(value, row) : value}
                    </td>
                  );
                })}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
