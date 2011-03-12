(function() {
	var jslitmus, _, doU, doT,
		data = { f1: 1, f2: 2, f3: 3},
		snippet = "<h1>Just static text</h1>\
		<p>Here is a simple {{=it.f1}} </p>\
		<div>test {{=it.f2}}\
		<div>{{=it.f3}}</div>\
		</div>";

	if (typeof module !== 'undefined' && module.exports) {
		runTests();
	} else {
		window.onload = runTestsInBrowser;
	}

	function testsetup(snippet) {
		// doU (improved underscore) with 'it'
		var doUCompiled = doU.template(snippet);
		// doT (modified jQote2) with 'it'
		var doTCompiledParam = doT.template(snippet);
		// doT with 'this'
		var doTCompiled = doT.template(snippet.replace(/=it\./g, '=this.'));

		jslitmus.test('doU.js', function() {
			doUCompiled(data);
		});

		jslitmus.test('doU.js - looping', function(count) {
			while (count--) {
				doUCompiled(data);
			}
		});

		jslitmus.test('doT.js - using this', function() {
			doTCompiled.call(data);
		});

		jslitmus.test('doT.js - using this - looping', function(count) {
			while (count--) {
				doTCompiled.call(data);
			}
		});

		jslitmus.test('doT.js - using it', function() {
			doTCompiledParam(data);
		});

		jslitmus.test('doT.js - using it - looping', function(count) {
			while (count--) {
				doTCompiledParam(data);
			}
		});
	}

	function runTests() {
		//var sys = require('sys');
		jslitmus = require('./jslitmus.js');
		doU = require('./templating/doU.js');
		doT = require('./templating/doT.js');
		var passOne = 0;
		console.log("*** Small template length: " + snippet.length);
		testsetup(snippet);
		// Log the test results
		jslitmus.on('complete', function(test) {
			//console.log(sys.inspect(process.memoryUsage()));
			console.log(test.toString());
		});
		// 'all_complete' fires when all tests have finished.
		jslitmus.on('all_complete', function() {
			switch (passOne) {
			case 0:
				passOne++;
				for(var i=0; i<5; i++) { snippet += snippet; }
				console.log("*** Medium template length: " + snippet.length);
				break;
			case 1:
				passOne++;
				for(var i=0; i<3; i++) { snippet += snippet; }
				console.log("*** Large template length: " + snippet.length);
				break;
			default:
				return;
			}

			jslitmus.clearAll();
			testsetup(snippet);
			jslitmus.runAll();
		});
		// Run it!
		jslitmus.runAll();
	}

	function runTestsInBrowser() {
		jslitmus = window.jslitmus;doU = window.doU;doT = window.doT;

		var resultTmpl = doT.template("<h3>Template length : {{=it.size}} </h3>	<img src='{{=it.url}}'/>");
		var currentSet = document.getElementById('small');
		testsetup(snippet);
		// 'complete' fires for each test when it finishes.
		jslitmus.on('complete', function(test) {
		// Output test results
			currentSet.innerHTML += test + '<br/>';
		});
		// 'all_complete' fires when all tests have finished.
		jslitmus.on('all_complete', function() {
			// Get the results image URL
			var url = jslitmus.getGoogleChart();
			if (currentSet.id === 'small') {
				currentSet.innerHTML += resultTmpl({size: snippet.length, url: url});
				setTimeout(function() {
					jslitmus.clearAll();
					currentSet = document.getElementById('large');
					for(var i=0; i<8; i++) { snippet += snippet; }
					testsetup(snippet);
					jslitmus.runAll();
				}, 10);
			} else {
				currentSet.innerHTML += resultTmpl({size: snippet.length, url: url});
			}
		});
		// Run it!
		jslitmus.runAll();
	}
})();
