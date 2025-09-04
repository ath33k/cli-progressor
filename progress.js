import { createReadStream, statSync } from "fs";
import { PassThrough } from "stream";

const filePath = "./big.file";

const { size } = statSync(filePath);

let processedBytes = 0;

console.log("file size", size / 1e9, "GB", "\n");

const startTime = Date.now();
const fileStream = createReadStream(filePath);

const loader = (chunk) => {
  processedBytes += chunk.length;
  const percent = ((processedBytes / size) * 100).toFixed(2);
  process.stdout.write(`\rProgress : ${percent}%`);
};

const through = PassThrough();
through.on("data", loader);

fileStream.pipe(through);
fileStream.on("end", () => {
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  process.stdout.write("\n");
  console.log(`File read successfully! Total time: ${elapsed} seconds`);
});
