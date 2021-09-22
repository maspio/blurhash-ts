import fs from "fs";
import path from "path";

const fileExtension = (p: string) => path.extname(p).slice(1);
const fileName = (p: string) => path.basename(p).split(".")[0];
const normPath = (p: string) => path.normalize(path.resolve(p));
const toRelative = (p: string) => path.relative("./", p);
const readFile = (p: string) => fs.readFileSync(p, "utf8");
const writeFile = (p: string, text: string) =>
  fs.writeFileSync(p, text, "utf8");
const parentDir = (p: string) => path.normalize(path.join(p, ".."));

const toMinFileName = (filePath: string) => {
  const extension = pathy.fileExtension(filePath);
  const name = pathy.fileName(filePath);
  return `${name}.min.${extension}`;
};

const toMinFilePath = (p: string) => {
  return path.join(path.dirname(p), toMinFileName(p));
};

export const pathy = {
  fileExtension,
  fileName,
  normPath,
  toRelative,
  readFile,
  writeFile,
  parentDir,
  toMinFileName,
  toMinFilePath,
};
