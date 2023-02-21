/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		domains: ["localhost", "beta.imageproof.ai"],
		unoptimized: true,
	},
	env: {
		DOMAIN_NAME: "https://beta.imageproof.ai",
	},
	async redirects() {
		return [
			{
				source: "/",
				destination: "/login",
				permanent: true,
			},
		];
	},
};

module.exports = nextConfig;
