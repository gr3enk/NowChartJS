import * as fs from "fs";

try {
    fs.existsSync("output") || fs.mkdirSync("output");
    fs.existsSync("input") || fs.mkdirSync("input");
} catch (error) {}
