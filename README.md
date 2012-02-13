LazyReload
==========

## A simple JavaScript library which reloads the browser window on demand

The LazyReload library monitors changes on predefined files and refreshes the browser window automatically whenever one of these files was changed. It uses XMLHttpRequests (Ajax) and a certain interval to read out the latest information of the monitored files. The determination of a changed file can be set using different methods (header information, content length, content).

## Usage

After loading "LazyReload.js" in your main file, LazyReload is available in the global namespace and must be instantiated as an object.

### Defaults

```javascript
/*
 * LazyReload instantiation (all arguments are optional)
 * 
 * @param Array files List of the files which shall be monitored
 * @param Number interval Interval for determining file changes
 * @param String method Monitoring method (either "header", "length" or "content")
 */

var LazyReloader = new LazyReload(files, interval, method);
```

By leaving the arguments, LazyReload loads up with an default interval of 1000ms and the monitoring method "header" which compares the response information of the header "Last-Modified". This method only works when a web server (e.g. Apache) is running. If you want to monitor local file changes without a web server, you need to use one of the other monitoring methods (either "length" or "content").

### Examples

```javascript
// Basic usage 1 (using the default "header" method)
var LazyReloader = new LazyReload(["index.html", "styles.css"], 500);
LazyReloader.activate();

// Basic usage 2 (using the "length" method)
var LazyReloader = new LazyReload(["index.html", "styles.css"], 500, "length");
LazyReloader.activate();

// Alternative usage 1 (using default options)
var LazyReloader = new LazyReload();
LazyReloader.add("index.html");
LazyReloader.add("styles.css");
LazyReloader.activate();

// Alternative usage 2 (using custom options)
var LazyReloader = new LazyReload(500, "content");
LazyReloader.add("index.html");
LazyReloader.add("styles.css");
LazyReloader.activate();

// Deactivate LazyReload
LazyReloader.deactivate();
```

## Notes
* **Interval:** The update interval should not be set under 100ms since accidental reloads may occur.
* **Monitoring methods:** The method "length" should only be a choice if you make larger changes on your files. The methods "length" and "header" were implemented to reduce time for the comparison. The "content" method also works fine so it's more a matter of taste.

## License

LazyReload is released under the MIT license.