interface ErrorMessageDisplayProps {
  title?: string;
  message: string;
  children?: React.ReactNode;
}

export default function ErrorMessageDisplay({
  title,
  message,
  children,
}: ErrorMessageDisplayProps) {
  return (
    <div className="w-full flex flex-col justify-center items-center gap-40">
      <h1 className="font-semibold text-3xl font-sinchon text-center">
        {title && (
          <>
            {title}
            <br />
          </>
        )}
        {message.split("\n").map((line, index) => (
          <span key={index}>
            {line}
            {index < message.split("\n").length - 1 && <br />}
          </span>
        ))}
      </h1>
      {children}
    </div>
  );
}
