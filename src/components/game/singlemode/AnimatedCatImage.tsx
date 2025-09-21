import sneackycat from "../../../assets/images/sneakycat.gif";

interface AnimatedCatImageProps {
  imageRef: React.RefObject<HTMLImageElement | null>;
  width?: string;
  alt?: string;
}

export default function AnimatedCatImage({
  imageRef,
  width = "380px",
  alt = "도둑 고양이",
}: AnimatedCatImageProps) {
  return (
    <img ref={imageRef} src={sneackycat} alt={alt} className={`w-[${width}]`} />
  );
}
