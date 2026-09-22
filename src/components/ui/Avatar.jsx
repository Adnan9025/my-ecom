export default function Avatar({
  src,
  name,
  size = 48,
}) {
  return (
    <img
      src={src}
      alt={name}
      width={size}
      height={size}
      className="rounded-full object-cover border"
    />
  );
}