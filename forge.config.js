module.exports = {
	packagerConfig: {
		name: "autumn",
		icon: "public/icon.png",
		asar: true, // Source Code Will Be packaged in Asar file.
		junk: true, // Don't Include Junk Files Like .DS_Store.
		prune: true, // Doesn't Include Dev Dependencies in Build
		win32metadata: {
			ProductName: "autumn",
			CompanyName: "autumn",
			FileDescription: "A Code Editor",
			InternalName: "autumn",
			OriginalFilename: "autumn.exe"
		},
		appCategoryType: "app-category-type=public.app-category.developer-tools",
		ignore: [
			/src/,
			/LICENSE/,
			/.github/,
			/.gitignore/,
			/README.md/,
			/forge.config.js/,
			/package-lock.json/
		]
	},
	makers: [
		{
			name: "@electron-forge/maker-zip",
			platforms: [ "darwin", "linux", "win32" ]
		}
	]
}
