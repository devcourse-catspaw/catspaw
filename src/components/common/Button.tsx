type FontWeightOption = "thin" | "regular" | "semibold" | "bold" | "extraBold";
const weightMap: Record<FontWeightOption, number> = {
  thin: 100,
  regular: 400,
  semibold: 600,
  bold: 700,
  extraBold: 800,
};
export default function Button({
  fontSize,
  fontWeight,
  btnPX,
  btnPY,
  backgroundColor,
  children,
  onClick,
}: {
  fontSize: number;
  fontWeight: FontWeightOption;
  btnPX: number;
  btnPY: number;
  backgroundColor: string;
  children: React.ReactNode;

  onClick?: () => void;
}) {
  const numericWeight = weightMap[fontWeight];

  return (
    <>
      <h1>Button Component</h1>
      <div className="m-[100px]">
        <button
          style={{
            fontSize: `${fontSize}px`,
            fontWeight: `${numericWeight}`,
            //py: padding y값, px: padding x값
            padding: `${btnPY}px ${btnPX}px `,
            backgroundColor: `${backgroundColor}`,
            border: "2px solid black",
            boxShadow: "0px 4.74px 0px rgb(0,0,0)",
            borderRadius: "6px",
            textAlign: "center",
            cursor: "pointer",
          }}
          onClick={onClick}>
          {children}
        </button>
      </div>
    </>
  );
}
