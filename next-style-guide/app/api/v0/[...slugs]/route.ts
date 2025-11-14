async function handle(
  request: Request,
  context: RouteContext<"/api/v0/[...slugs]">,
) {
  const params = await context.params;
  return new Response();
}

export async function GET(
  request: Request,
  context: RouteContext<"/api/v0/[...slugs]">,
) {
  return handle(request, context);
}

export async function HEAD(
  request: Request,
  context: RouteContext<"/api/v0/[...slugs]">,
) {
  return handle(request, context);
}

export async function POST(
  request: Request,
  context: RouteContext<"/api/v0/[...slugs]">,
) {
  return handle(request, context);
}

export async function PUT(
  request: Request,
  context: RouteContext<"/api/v0/[...slugs]">,
) {
  return handle(request, context);
}

export async function DELETE(
  request: Request,
  context: RouteContext<"/api/v0/[...slugs]">,
) {
  return handle(request, context);
}

export async function PATCH(
  request: Request,
  context: RouteContext<"/api/v0/[...slugs]">,
) {
  return handle(request, context);
}

// If `OPTIONS` is not defined, Next.js will automatically implement `OPTIONS` and set the appropriate Response `Allow` header depending on the other methods defined in the Route Handler.
// export async function OPTIONS(request: Request) {}
