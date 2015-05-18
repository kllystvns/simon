// This program depends on variable (of window), object.name, 
// and html id being the same thing, in order to be queried.
// Problem?

function Key(keyName) {
	// REPLACE L8R with SVG	
	// this.object = $('<object>');
	// //===CANT PUT THIS HERE~~HASNT BEEN NAMED YET===
	//this.svg = document.querySelector('#' + this.name + "-svg");
	// this.object.appendTo($('body'));
	// this.object.attr('data', currentSVG);
	// this.object.attr('type', 'image/svg+xml');
	// this.graphic = graph.svg;
	// $(this.object).click(this.pressed);
	// this.svg = Snap(svg)
	// var pressed = function() {
	// 	this.$div.css("background-color", "blue");
	// }
	// this.$div.click(pressed);
	// this.name = keyName;
	// console.log(graph);
	// this.graphic = graph.svg;
	this.name = keyName;
	this.svg = currentSVG.querySelector("#" + keyName + "-svg");
	//var pressedBound = pressed.bind(this);
	var bound = this.pressed.bind(this);
	$(this.svg).click(bound);
	//RESTORE THIS!!!!!!!!!!!!

	// $(window["key" + i].object).attr('id', "key" + i);
	// $(window["key" + i].object).attr('class', "key");
	// window["key" + i].object.svg = Snap("key" + i);


}

Key.prototype.pressed = function() {   // but why is "this" not the thing that calls "pressed"?
	//thisKey = (window[$(this).name]);   // gets jsObject connected to div
	$(this.svg).fadeTo(799, 0.1, function() {
		$(this).fadeTo(799, 1);
	});
	console.log(this.name);
	this.currScore.playerNotes.push(this.name); // score is a property of key... and vice versa
	// if (thisKey.currScore.playerNotes.length === 1) { 
	// 	(function(passThis) { // sets timer for player 
	// 		window.measureId = window.setTimeout(passThis.currScore.measure
	// 			, 700 * passThis.currScore.notes.length);
	// 	})(thisKey);
	// }
	if (this.currScore.playerNotes.length === this.currScore.notes.length) {
		clearTimeout(measureId);
		this.currScore.measure();
	}
}

function PlayButton() {
	// this.div = $('<div>');
	this.svg = currentSVG.querySelector("#playbutton-svg");
	//===CANT PUT THIS HERE~~HASNT BEEN NAMED YET===
	// $(this.div).attr('id', this.name);
	// this.div.attr("class", "play-button");
	// this.div.append($('<div>').html('PLAY').attr('class', 'play-text'));
	// this.div.appendTo($('body'));
	$(this.svg).click(this.nextMeasure);
}

PlayButton.prototype.nextMeasure = function() {
	$(this).fadeTo(80, 0.5, function() {
		$(this).fadeTo(80, 1);
	});
	score.callOut();
}

function Score() {
	this.keyNumber = Math.ceil(Math.random() * 5 + 2);
	window.currentSVG = document.querySelector("#svg" + this.keyNumber);
	$(currentSVG).show();

	chroma(this);
	this.keyNames = [];
	for (var i = 0; i < this.keyNumber; i++) {
		this.keyNames.push("key" + i);
	}
	for (i = 0; i < this.keyNumber; i++) {
		window["key" + i] = new Key("key" + i);
		window["key" + i].currScore = this;
		//window["key" + i].svg = document.querySelector('#key' + i + "-svg");

		// window["key" + i].graphic
		// $(window["key" + i].object).attr('id', "key" + i);
		// $(window["key" + i].object).attr('class', "key");
		// window["key" + i].object.svg = Snap("key" + i);
	}
	window.playButton = new PlayButton();
	this.notes = [];
	this.playerNotes = [];
	this.measures = 0;
	this.div = $('<div>');
	$('body').append(this.div.attr('class', 'measures'));
	this.notes.push(this.keyNames[Math.floor(Math.random() * this.keyNumber)]);
	
	//this.currentSVG = "url("
}

// var fade = function(x) {
// 	$(x).fadeTo(799, 0.5, function() {
// 		$(x).fadeTo(799, 1);
// 	});
// }

Score.prototype.callOut = function() {
	var i = 0;
	var passThis = this;
	//fade('#' + passThis.notes[0]);    //necessary in order to fire immediately
	window.callIntervalId = setInterval(function() {
		console.log(passThis);
		$(window[passThis.notes[i]].svg).fadeTo(799, 0.5, function() {
			$(this).fadeTo(799, 1);
		}); 	
		i++;
	}, 1600);
	setTimeout(function() {
		clearInterval(callIntervalId);
		console.log(passThis);
		window.measureId = window.setTimeout(passThis.measure.bind(passThis), 1000 * passThis.notes.length + 2000);
	}, 1600 * passThis.notes.length + 2600); // extra 1600 cuz setinterval is delayed
}

Score.prototype.measure = function() {
	console.log(this);
	var isEquivalent = (this.playerNotes.length === this.notes.length);
	for (var i = 0; i < this.playerNotes.length; i++) {
		console.log(this.playerNotes[i] !== this.notes[i]);
		if (this.playerNotes[i] !== this.notes[i]) {
			isEquivalent = false;
		}
	}
	this.notes.push(this.keyNames[Math.floor(Math.random() * this.keyNumber)]);
	this.playerNotes = [];
	isEquivalent ? this.nSync() : this.unSync();
	console.log(isEquivalent);
}

Score.prototype.nSync = function() {
	this.measures++;
	$('.play-text').html('CORRECT').fadeTo(2000, 1, function() {
		$(this).html('PLAY');
	});
}

Score.prototype.unSync = function() {
	$('*').off();
	//$('.play-text').html('INCORRECT');
	$('.measures').html(this.measures + ' correct');
	$('.measures').css('z-index', '1');
	$('.measures').fadeTo(600, .7, function() {
		$(this).fadeTo(700, .7, function() {
			$(this).fadeTo(500, 0, function() {
				$(this).css('z-index', '-1');
				//$('.play-text').html('TRY AGAIN');
				$(playButton.svg).click(initialize);
			});
		})
	});
}

var chroma = function(passScore) {
	var genRGB = function() {
		return Math.floor(Math.random() * 155 + 100);
	}
	for (var i = 0; i < passScore.keyNumber; i++) {
		currentSVG.querySelector('#key' + i + '-svg').style.fill = 'rgb(' + genRGB() + ',' + genRGB() + ',' + genRGB() + ')';
	}
	currentSVG.querySelector('#playbutton-svg').style.fill = 'rgb(158,255,130)';
	currentSVG.querySelector('#playbutton-svg').style.fill = 'rgb(60,230,255)';
	// this.object = document.createElement('object')
	// this.object.setAttribute('id', 'graph');
	// this.object.setAttribute('data', svg);
	// this.object.setAttribute('type', 'image/svg+xml');
	// document.body.appendChild(this.object);
	// for (var i = 0; i < window.keyNumber; i++) {
	// 	this['key' + i] = window['key' + i];
	// }
}

//init
var initialize = function() {
	$('*').off();
	$(playButton.svg).off();
	$('div').remove();
	$('svg').hide();
	window.score = new Score();
}

$('svg').hide();
window.score = new Score();




//window[viariable name string]