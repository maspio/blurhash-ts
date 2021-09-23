import { minify, MinifyOptions, ECMA } from "terser";

import { pathy } from "./file";

const files = [
  "dist/index.mjs",
  "dist/decode.mjs",
  // "dist/encode.mjs",
  // "dist/decode.js",
  // "dist/encode.js",
  // "dist/index.js",
];

type MinOpts = {
  module: boolean;
  mangle: boolean;
  ecma: ECMA;
  extreme: boolean;
};

const DefaultMinOpts: MinOpts = {
  module: true,
  mangle: true,
  ecma: 2020,
  extreme: false,
};

const createMinifyOptions = (
  options: Partial<MinOpts> = DefaultMinOpts
): MinifyOptions => {
  const opts = { ...options, ...DefaultMinOpts };
  return {
    module: opts.module,
    mangle: opts.mangle,
    format: opts.extreme ? { comments: false } : undefined,
    compress: {
      passes: 2,
      unsafe: opts.extreme || undefined,
      unused: opts.extreme || undefined,
      side_effects: false,
    },
    ecma: opts.ecma,
  };
};

const log = (msg: string) => console.log(msg);

const main = (extension: string, opts: MinifyOptions) => {
  return Promise.all(
    files.map((f) => {
      const input = pathy.normPath(f);
      const content = pathy.readFile(input);
      const output = pathy.prependFileExtension(input, extension);
      return minify(content, opts).then((minified) => {
        pathy.writeFile(output, minified.code!);
        log(`${pathy.toRelative(input)} => ${pathy.toRelative(output)}`);
        return { input, output, minified };
      });
    })
  );
};

(async () => {
  try {
    await Promise.all([
      main("min", createMinifyOptions()),
      // main("minx", createMinifyOptions({ extreme: true })),
    ]);
  } catch (e) {
    console.error("error", e);
  }
})();
