publish:
	rm -rf dist && pnpm build && cp package.json dist && sed -i 's,./dist/index,./index,g' dist/package.json && pnpm publish
