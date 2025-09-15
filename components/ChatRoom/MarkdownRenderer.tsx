import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <ReactMarkdown
        components={{
          h1: ({ children }) => <h1 className="text-xl font-semibold mb-2">{children}</h1>,
          h2: ({ children }) => <h2 className="text-lg font-semibold mb-2">{children}</h2>,
          h3: ({ children }) => <h3 className="text-base font-semibold mb-1">{children}</h3>,
          p: ({ children }) => <p className="mb-2">{children}</p>,
          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
          ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
          li: ({ children }) => <li>{children}</li>,
          code: ({ children }) => <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono">{children}</code>,
          pre: ({ children }) => <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-x-auto mb-2">{children}</pre>,
          blockquote: ({ children }) => <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic mb-2">{children}</blockquote>,
          a: ({ children, href }) => <a href={href} className="text-blue-500 hover:text-blue-700 underline">{children}</a>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
