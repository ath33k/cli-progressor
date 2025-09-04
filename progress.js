import { createReadStream, statSync } from "fs";
import { PassThrough } from "stream";

const filePath = "./big.file";

const { size } = statSync(filePath);

const reset = "\x1b[0m";
const green = "\x1b[32m";
const filledBar = "\u2588";
const emptyBar = "\u2591";

const totalBlocks = 30;
let processedBytes = 0;

console.log(`\n📦 file size, ${size / 1e9} GB`);

const startTime = Date.now();
const fileStream = createReadStream(filePath);

const loader = (chunk) => {
  processedBytes += chunk.length;
  const percent = processedBytes / size;
  const filledBlocks = Math.floor(percent * totalBlocks);
  const emptyBlocks = totalBlocks - filledBlocks;
  const bar = `${filledBar.repeat(filledBlocks)}${emptyBar.repeat(
    emptyBlocks
  )}`;

  const elapsedSeconds = (Date.now() - startTime) / 1000;
  const speedBytesPerSec = processedBytes / elapsedSeconds;

  const speedMBps = speedBytesPerSec / (1024 * 1024);
  const speedGBps = speedBytesPerSec / 1024 ** 3;

  let speedStr;
  if (speedGBps >= 1) {
    speedStr = `${speedGBps.toFixed(2)} GB/s`;
  } else {
    speedStr = `${speedMBps.toFixed(2)} MB/s`;
  }

  process.stdout.write("\r\x1b[2K");
  process.stdout.write(
    `⏳Reading file: ${green}[${bar}] ${(percent * 100).toFixed(
      2
    )}%${reset} ${speedStr}`
  );
};

const through = PassThrough();
through.on("data", loader);

fileStream.pipe(through);
fileStream.on("end", () => {
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  process.stdout.write("\n");
  console.log(`File read successfully! Total time: ${elapsed} seconds`);
});
