import ReactMarkdown from "react-markdown";

interface MarkdownProps {
  children: string;
}

export function Markdown({ children }: MarkdownProps) {
  return (
    <ReactMarkdown
      components={{
        h4: ({ ...props }) => <h4 className="font-bold mb-2" {...props} />,
        p: ({ ...props }) => (
          <p
            className="leading-relaxed text-muted-foreground mb-8 [li>&]:mb-0 [ol>&]:mb-0 [ul>&]:mb-0"
            {...props}
          />
        ),
        ul: ({ ...props }) => (
          <ul className="list-disc list-outside mt-0 mb-8" {...props} />
        ),
        ol: ({ ...props }) => (
          <ol className="list-decimal list-outside ml-4" {...props} />
        ),
        li: ({ ...props }) => (
          <li className="text-muted-foreground mb-1" {...props} />
        ),
        a: ({ ...props }) => (
          <a className="text-primary underline" target="_blank" {...props} />
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
