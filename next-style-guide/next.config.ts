import { NextConfig } from "next";

const nextConfig: NextConfig = {
  // rewrites: () => [
  //   {
  //     source: "/:locale/home",
  //     destination: "/:locale",
  //   },
  // ],
  // trailingSlash: true,
  // images: {
  //   unoptimized: true,
  // },
  reactCompiler: true,
  // output: "standalone",
  cacheComponents: true,
  // turbopack: {
  //   rules: {
  //     "*": {
  //       condition: {
  //         query: "?bytes",
  //       },
  //       type: "bytes",
  //     },
  //   },
  // },
};

export default nextConfig;
