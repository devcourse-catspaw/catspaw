type FontWeightOption =
  | "light"
  | "regular"
  | "medium"
  | "semiBold"
  | "bold"
  | "extraBold";
const weightMap: Record<FontWeightOption, number> = {
  light: 300,
  regular: 400,
  medium: 500,
  semiBold: 600,
  bold: 700,
  extraBold: 800,
};
export default function Button({
  fontSize,
  fontWeight = "semiBold",
  btnPX,
  btnPY,
  backgroundColor,
  children,
  onClick,
}: {
  fontSize: number;
  fontWeight?: FontWeightOption;
  btnPX: number;
  btnPY: number;
  backgroundColor: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const numericWeight = weightMap[fontWeight];

  return (
    <>
      <button
        style={{
          fontSize: `${fontSize}px`,
          fontWeight: `${numericWeight}`,
          //py: padding y값, px: padding x값
          padding: `${btnPY}px ${btnPX}px `,
          backgroundColor: `${backgroundColor}`,
          border: "2px solid var(--black)",
          boxShadow: "0px 5px 0px var(--black)",
          borderRadius: "6px",
          textAlign: "center",
          cursor: "pointer",
        }}
        onClick={onClick}>
        {children}
      </button>
    </>
  );
}
