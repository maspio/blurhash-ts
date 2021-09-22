import { minify, MinifyOptions, ECMA } from "terser";

import { pathy } from "./file";

const files = ["dist/decode.mjs", "dist/encode.mjs", "dist/index.mjs"];

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
  opts: MinOpts = DefaultMinOpts
): MinifyOptions => ({
  module: opts.module,
  mangle: opts.mangle,
  format: opts.extreme ? { comments: false } : undefined,
  compress: {
    passes: 2,
    unsafe: opts.extreme,
    unused: opts.extreme,
    side_effects: false,
  },
  ecma: opts.ecma,
});

const options = createMinifyOptions();

const main = () => {
  return Promise.all(
    files.map((f) => {
      const input = pathy.normPath(f);
      const content = pathy.readFile(input);
      const output = pathy.toMinFilePath(input);
      return minify(content, options).then((minified) => {
        pathy.writeFile(output, minified.code!);
        return {
          input,
          output,
          minified,
        };
      });
    })
  );
};

(async () => {
  try {
    await main().then((rr) =>
      rr.forEach((r) =>
        console.log(
          `${pathy.toRelative(r.input)} => ${pathy.toRelative(r.output)}`
        )
      )
    );
  } catch (e) {
    console.error("error", e);
  }
})();
