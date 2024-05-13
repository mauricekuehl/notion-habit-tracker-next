/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = nextConfig;
module.exports = {
  async redirects() {
    return [
      {
        source: "/add",
        destination:
          "https://api.notion.com/v1/oauth/authorize?owner=user&client_id=1798bf3b-8f69-409b-8b02-9b29fc346a5a&redirect_uri=https%3A%2F%2Fnotion.mauricekuehl.com/api/redirect&response_type=code",
        permanent: true,
      },
    ];
  },
};
