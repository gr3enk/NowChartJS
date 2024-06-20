# NowChartJS

NowChartJS creates a modified [Chart.js](https://github.com/chartjs/Chart.js) Version for Service Now compatibilty.

The [Rhino Intepreter](<https://en.wikipedia.org/wiki/Rhino_(JavaScript_engine)>) which is used by Service Now to compile JavaScript code is not able to compile [Template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals). All Template literals are removed after compilation. Since these are used by the Chart.js library, the compiler throws errors and the JavaScript can't be processed correclty.

NowChartJS transcribes all Template literals for Rhino compatibility.

## How to use

Install all dependencies.

```bash
npm i
```

Setup the environment.

```bash
npm run setup
```

Drop the JS-Library into the input directory.

Then run:

```bash
npm run build
```

You will be asked whether the output should be minified (recommended).

The compiled files are written to the output directory.
In addition, a changelog file is created in the output directory, which contains all changes from the compilation process.

## Explanation with Chart.js

The following example has been changed in the NowChartJS library compared to the original Chart.js library

```javascript
// Chart.js v4.4.2
// ❌ does not work with Rhino
return `${t.id}.${e.id}.${i.stack || i.type}`;
```

```javascript
// Chart.js v4.4.2 (modified NowChartJS version)
// ✅ works with Rhino
return t.id + "." + e.id + "." + (i.stack || i.type);
```

## Other use cases

Technically, NowChartJS can also be used for libraries other than Chart.js to convert template literals for Rhino compatibilty

## Credits

-   [Chart.js](https://github.com/chartjs/Chart.js)
-   [terser](https://www.npmjs.com/package/terser)
-   [readline-sync](https://www.npmjs.com/package/readline-sync)

## License

[MIT](https://choosealicense.com/licenses/mit/)
