import { minify } from "terser";
import * as fs from "fs";
import * as readline from "readline-sync";

const minifyConfig = {
    compress: false,
    mangle: {
        eval: false,
        keep_classnames: false,
        keep_fnames: false,
        toplevel: false,
        safari10: false,
    },
    module: false,
    sourceMap: false,
    output: {
        comments: "some",
    },
};

try {
    const inputFileNames = fs.readdirSync("input");
    if (inputFileNames.length === 0) {
        console.error("No files in the input directory!");
        process.exit(1);
    }
    if (inputFileNames.length > 0) {
        let minJsFile = false;
        inputFileNames.forEach((inputFileName) => {
            if (inputFileName.endsWith(".js")) minJsFile = true;
        });
        if (!minJsFile) {
            console.error("No .js files in the input directory!");
            process.exit(1);
        }
    }
} catch (error) {
    console.error("No input folder found! Run 'npm run setup'");
    process.exit(1);
}

let optionsMinify = readline.question("Minify output? (y/n): ");

fs.existsSync("output") || fs.mkdirSync("output");

try {
    const inputFileNames = fs.readdirSync("input");
    console.log("Found following input files: " + inputFileNames.join(", "));
    readline.question("The input files will be deleted after compile. Press Enter to continue...");
    inputFileNames.forEach((inputFileName) => {
        if (!inputFileName.endsWith(".js")) return;
        console.log("Compiling " + inputFileName + "...");
        const inputFile = fs.readFileSync("input/" + inputFileName, "utf8");
        let fileStr = inputFile.toString().split("");

        let intl = false;
        let tlstart = 0;
        let tlend = 0;
        let tlindex = [];
        let changes = [];
        for (let c in fileStr) {
            c = parseInt(c);
            if (fileStr[c] == "`" && !intl) {
                fileStr[c] = '"';
                tlstart = c;
                intl = true;
                continue;
            }
            if (fileStr[c] == "`" && intl) {
                fileStr[c] = '"';
                tlend = c;
                intl = false;
                changes.push({ position: { tlIndex: tlindex, stringStart: tlstart, stringEnd: tlend }, type: "template literal" });
                tlindex = [];
                continue;
            }
            if (intl) {
                if (fileStr[c] == "$" && fileStr[parseInt(c) + 1] == "{") {
                    console.log("converted template literal! at char " + c);
                    tlindex.push(c);
                    let varIndex = 0;
                    let varContent = [];
                    while (fileStr[c] != "}") {
                        if (varIndex > 1) {
                            varContent.push(fileStr[c]);
                        }
                        fileStr[c] = "";
                        c++;
                        varIndex++;
                    }
                    fileStr[c] = "";
                    if (
                        varContent.includes("+") ||
                        varContent.includes("&") ||
                        varContent.includes("|") ||
                        varContent.includes(":") ||
                        varContent.includes("-") ||
                        varContent.includes("*") ||
                        varContent.includes("/") ||
                        varContent.includes("%") ||
                        varContent.includes("?") ||
                        varContent.includes("!") ||
                        varContent.includes("<") ||
                        varContent.includes(">") ||
                        varContent.includes("=")
                    ) {
                        fileStr.splice(c, 1, '"+(' + varContent.join("") + ')+"');
                    } else {
                        fileStr.splice(c, 1, '"+' + varContent.join("") + '+"');
                    }
                }
            }
        }

        if (optionsMinify == "n") {
            fs.writeFileSync("output/rhino_" + inputFileName, fileStr.join(""));
            console.log("File written to output/rhino_" + inputFileName);
            fs.unlinkSync("input/" + inputFileName);
        } else {
            minify(fileStr.join(""), minifyConfig).then((result) => {
                fs.writeFileSync("output/rhino_" + inputFileName, result.code);
                console.log("File written to output/rhino_" + inputFileName);
                fs.unlinkSync("input/" + inputFileName);
            });
        }

        let changelog = ["# Changelog for " + inputFileName];
        changes.forEach((change) => {
            changelog.push("### " + change.type);
            changelog.push("```");
            changelog.push(inputFile.slice(change.position.stringStart, change.position.stringEnd + 1));
            changelog.push("```");
        });

        fs.writeFileSync("output/rhino_" + inputFileName + ".changelog.md", changelog.join("\n"));
        console.log("Changelog written to output/rhino_" + inputFileName + ".changelog.md");
    });
} catch (error) {
    console.error(error);
    process.exit(1);
}
