# NowChartJS

NowChartJS is a modified [Chart.js](https://github.com/chartjs/Chart.js) Version for Service Now.

The [Rhino Intepreter](<https://en.wikipedia.org/wiki/Rhino_(JavaScript_engine)>) which is used by Service Now to compile JavaScript code is not able to compile [Template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals). All Template literals are removed after compilation. Since these are used by the Chart.js library, the compiler throws errors and the JavaScript can't be processed correclty.

NowChartJS transcribes all Template literals for Rhino compatibility. See the changelog files for all modifications.

## Example

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

## Credits

[Chart.js](https://github.com/chartjs/Chart.js)

## License

[MIT](https://choosealicense.com/licenses/mit/)
# NowChartJS
