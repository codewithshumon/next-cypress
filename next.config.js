/** @type {import('next').NextConfig} */
const nextConfig = {
  mages: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fmliqecnrxgzwvucipeu.supabase.co',
        port: '',
        pathname: '**',
      },
    ],
  },
};

module.exports = nextConfig;
