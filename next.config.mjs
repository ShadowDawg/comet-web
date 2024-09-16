/** @type {import('next').NextConfig} */
   const nextConfig = {
     reactStrictMode: true,
     images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'firebasestorage.googleapis.com',
          port: '',
          pathname: '/v0/b/astro-app1.appspot.com/o/**',
        },
      ],
    },
     async headers() {
       return [
         {
           source: '/:path*',
           headers: [
             {
               key: 'Cross-Origin-Opener-Policy',
               value: 'same-origin-allow-popups',
             },
           ],
         },
       ];
     },
   };

   export default nextConfig;