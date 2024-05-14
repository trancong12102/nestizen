publish:
	rm -rf dist && pnpm build && cp package.json dist && sed -i 's,"main": "./dist/index.js","main": "index.js",g' dist/package.json && pnpm publish
