import Link_ from "next/link";

export function Link(props: React.ComponentProps<typeof Link_>) {
  return <Link_ prefetch={false} {...props}></Link_>;
}
