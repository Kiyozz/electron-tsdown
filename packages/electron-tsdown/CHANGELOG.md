## 10.0.0

### Features

- electron@36

## 9.0.0

### Features

- electron@30

### Breaking Changes

- now flagged as type module in package.json
- This package is now pure ESM (because electron-tsdown is mainly a cli, this should work out of the box).
  Please [read this](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).

## 8.0.0

### Breaking Changes

- require node@18.15.0 to be synchronized with electron@25.0.0
- support for esbuild@0.18 ([#53](https://github.com/Kiyozz/electron-tsdown/pull/53), thanks to [@jonluca](https://github.com/jonluca))

### Features

- electron@25

## 7.0.0

### Breaking Changes

- support for vite@4

## 6.0.0

### Breaking Changes

- **webpack supports** removed, use vite instead.
- electron-esbuild uses vite@3
- Fixed bug where users could not set their own port in vite.config.[ts/js].
  - 🚨 **Existing projects** will no longer use port `9080` by default. [Please modify the `server.port` property in your Vite config](https://vitejs.dev/config/server-options.html#server-port) to your port of choice, or update your project to accommodate the Vite default port `5173`.
  - New projects will set port `9080` as part of the initialization template.

## 5.0.2

### Changes

- Update dependencies
- Update vite peerDependency

## 5.0.1

### Changes

- Update electron-esbuild peerDependencies to include vite@2.8

## 5.0.0

### Breaking changes

- `--inspect` and `--remote-debugging-port` are no longer injected by electron-esbuild (see #36 and #40).

  If you need to debug the main process, use your IDE to start `electron-esbuild dev` in debug (vscode: launch config, Jetbrains: run configuration)

  To debug the renderer process, add `-- --remote-debugging-port` to `electron-esbuild dev`.
  Everything after `--` is transferred to the electron process. i.e: `electron-esbuild dev -- --remote-debugging-port`.
  - `--remote-debugging-port=9229` will start the devtools to the port 9229
  - `--remote-debugging-port` will start the devtools to a free port

  vscode users: create a launch configuration to attach to a Node.js/Chrome inspector.

  Jetbrains users: create a run configuration "Attach to Node.js/Chrome" to the port the console output gave you
  or click the `ws` url from the console output to attach immediately.

- Allow users to pass through extra arguments to the electron process when running `electron-esbuild dev`.
  i.e: `electron-esbuild dev -- --extra-argument-for-electron`

## v4.0.1

### Bug fixes

- Regression using esbuild for renderer process ([#34](https://github.com/Kiyozz/electron-esbuild/issues/34))

## v4.0.0

### Breaking Changes

- esbuild is now a peer dependency
- Require Node.js 14
- This package is now pure ESM (because electron-esbuild is mainly a cli, this should work out of the box).
  Please [read this](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).

## v3.0.1

### Changes

- Update peer dependencies to include vite@~2.7

## v3.0.0

### Breaking Changes

- This is a breaking change if you're using webpack for your renderer: now require webpack-dev-server 4 and webpack 5,
  and it's new dependencies

### Changes

- Update @electron-esbuild/create-app templates

## v2.0.0

### Breaking Changes

- Change minimum vite version to >=2.4

### Features

- Use esm, TypeScript or cjs for your configuration files (esbuild, vite, webpack)

  You will be able to write your esbuild/vite/webpack config in TypeScript/ESM/CJS (CJS was the default behavior)

## v1.5.1

### Bug fixes

- Using electron-esbuild without rendererConfig

## v1.5.0

### Features

- Expose main process debug port at 9223 (--inspect)
- Expose renderer process debug port at 9222 (--remote-debugging-port)

### Bug fixes

- Remove COEP headers in esbuild development server (from [@josteph](https://github.com/josteph)), closed by [#17](https://github.com/Kiyozz/electron-esbuild/pull/17)

## v1.4.1

### Bug fixes

- The Electron process should now be killed when an error appears when starting the application

## v1.4.0

### Features

- Use vite in the renderer!

  Vite is available in the `svelte`, `svelte-ts`, `react-vite`, `react-vite-ts` templates when using `npm init @electron-esbuild/app`.

## v1.3.1

### Dependencies

- bump esbuild peerDependencies from ^0.10.0 to 0.x

## v1.3.0

### Features

- Add ability to use electron-esbuild without a renderer

## v1.2.5

### Dependencies

- Upgrade to esbuild v0.10.0

## v1.2.4

### Bug fixes

- Fix `cannot find module 'webpack'`

## v1.2.3

### Bug fixes

- v1.2.2 fix was incomplete

## v1.2.2

### Bug fixes

- Using webpack, plugins/minimizer classes instance was discarded and cause webpack to fail

## v1.2.1

### Features

- If you're using webpack for the renderer, and your configuration file was invalid, the error was silenced.

## v1.2.0

### Bug fixes

- NODE_ENV was not set in the user configuration

### Breaking changes

**Users configuration file is no longer a function**

You need to export an object from your esbuild configuration or your webpack configuration

From

```javascript
module.exports = (merge) => ({
  ...yourConfig,
  ...merge,
})
```

To

```javascript
module.exports = {
  ...yourConfig,
}
```

## v1.1.6

### Bug fixes

- NODE_ENV was not set to `production` during a build
