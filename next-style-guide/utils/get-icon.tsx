const iconSvg = import("@/app/[locale]/icon.svg?bytes" as string);

export async function getIcon(style?: React.CSSProperties) {
  const { default: svg } = await iconSvg;

  return (
    <img
      src={`data:image/svg+xml,${encodeURIComponent(new TextDecoder().decode(svg))}`}
      alt=""
      style={style}
    />
  );
}
