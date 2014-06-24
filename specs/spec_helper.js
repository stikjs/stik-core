var jsdom = require("jsdom").jsdom;
GLOBAL.document = jsdom("<html><head></head><body></body></html>");
GLOBAL.window = document.parentWindow;
document.implementation.createHTMLDocument = jsdom;

require("../src/setup");
require("../src/injectable");
require("../src/controller");
require("../src/action");
require("../src/context");
require("../src/behavior");
require("../src/boundary");
require("../src/injector");
require("../src/manager");
require("../src/public");

require("stik-labs.js");
