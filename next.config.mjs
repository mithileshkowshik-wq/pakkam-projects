/** @type {import('next').NextConfig} */
const nextConfig = {
  // isomorphic-dompurify pulls in jsdom -> html-encoding-sniffer -> @exodus/bytes, whose
  // encoding-lite.js is an ES module required via require() — Next's serverless build trace
  // bundles it as CommonJS and that require() throws ERR_REQUIRE_ESM at runtime on Vercel (does
  // not reproduce in local `next dev`/`next start`, only in the traced Lambda bundle). Marking it
  // external makes Node's own module resolution load it at runtime instead of webpack's, which
  // handles the ESM/CJS interop correctly.
  experimental: {
    serverComponentsExternalPackages: ['isomorphic-dompurify', 'jsdom'],
  },
};

export default nextConfig;
