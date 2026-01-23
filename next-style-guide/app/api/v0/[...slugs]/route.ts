async function handle(
  request: Request,
  context: RouteContext<"/api/v0/[...slugs]">,
) {
  const params = await context.params;
  return Response.json({ params: params });
}

export const GET = handle;
export const HEAD = handle;
export const POST = handle;
export const PUT = handle;
export const DELETE = handle;
export const PATCH = handle;

// If `OPTIONS` is not defined, Next.js will automatically implement `OPTIONS` and set the appropriate Response `Allow` header depending on the other methods defined in the Route Handler.
// export async function OPTIONS(request: Request) {}
