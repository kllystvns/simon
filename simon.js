function Key(keyName) {
	this.name = keyName;
	this.svg = currentSVG.querySelector('.' + keyName + '-svg');
	$(this.svg).attr('class', keyName + '-svg key');
	this.audio = document.createElement('audio');
	this.audio.preload = 'auto';
	//simon_14 is the best :)) and 22
	this.audio.src = 'audio/simon_' + Math.floor(Math.random() * 49) + '.mp3'
	var pressedBound = this.pressed.bind(this);
	$(this.svg).click(pressedBound);
	var hoveredBound = this.hovered.bind(this);
	var unhoveredBound = this.unhovered.bind(this);
	$(this.svg).hover(hoveredBound, unhoveredBound);
}

var fade = function(key) {
	key.audio.currentTime = 0;
	key.audio.play();
	console.log(key.audio.src);
	$(key.svg).fadeTo(759, 0.9, function() {
		$(this).fadeTo(759, 0);
	});
}

Key.prototype.pressed = function() {   // but why is "this" not the thing that calls "pressed"?
	fade(this);
	this.currScore.playerNotes.push(this.name); // score is a property of key... and vice versa

	if (this.currScore.playerNotes.length === this.currScore.notes.length && this.currScore.notes.length > 1) {
		clearTimeout(measureId);
	}
	this.currScore.measure(true, false);
}

Key.prototype.hovered = function() {
	this.svg.style.opacity = '0.2';
}

Key.prototype.unhovered = function() {
	this.svg.style.opacity = '0';
}

var fontSmall = function(x) {
	x.style.fontSize = "20px";
}

var fontLarge = function(x) {
	x.style.fontSize = "34px";
}

function PlayButton() { // fix window.playtext ?
	this.textDiv = document.createElement('div');
	this.text = document.createElement('p');
	document.body.appendChild(this.textDiv);
	this.textDiv.appendChild(this.text); // why not appendChild?
	$(this.textDiv).attr('class', 'play-text');
	$(this.text).attr('class', 'play-text');
	$(this.text).html('PLAY')
	this.svg = currentSVG.querySelector(".playbutton-svg");
	$(this.svg).click(this.nextMeasure);
	$(this.text).click(this.nextMeasure);
	$(this.svg).hover(this.hovered, this.unhovered);
	$(this.text).hover(this.hovered, this.unhovered);
}

PlayButton.prototype.nextMeasure = function() {
	$(playButton.svg).fadeTo(80, 0.5, function() {
		$(playButton.svg).fadeTo(80, 1);
	});
	score.callOut();
}

PlayButton.prototype.hovered = function() {
	playButton.svg.style.opacity = '0.7';
	// this.style.cursor = 'pointer';
}

PlayButton.prototype.unhovered = function() {
	playButton.svg.style.opacity = '1';
}

function Score() {
	this.keyNumber = Math.ceil(Math.random() * 5 + 2);
	this.keyNumber = 5;
	window.currentSVG = document.querySelector("#svg" + this.keyNumber);
	$(currentSVG).show();

	chroma(this);
	this.keyNames = [];
	for (i = 0; i < this.keyNumber; i++) {
		this.keyNames.push("key" + i);
	}
	for (i = 0; i < this.keyNumber; i++) {
		window["key" + i] = new Key("key" + i);
		window["key" + i].currScore = this;
	}
	window.playButton = new PlayButton();
	this.notes = [];
	this.playerNotes = [];
	this.notes.push(this.keyNames[Math.floor(Math.random() * this.keyNumber)]);
	this.measures = 0;
	this.div = document.createElement('div');
	document.body.appendChild(this.div);
	$(this.div).attr('class', 'measures btm one');
	this.div = document.createElement('div');
	document.body.appendChild(this.div);
	$(this.div).attr('class', 'measures top one');
	this.div = document.createElement('div');
	document.body.appendChild(this.div);
	$(this.div).attr('class', 'measures btm two');
	this.div = document.createElement('div');
	document.body.appendChild(this.div);
	$(this.div).attr('class', 'measures top two');
	$('.measures.one').html('SIMON');
	$('.measures.two').html('SAYS');
	$('.measures').css('z-index', '1');
	$('.measures').fadeTo(1200 * loadTime, .9, function() {
		$(this).fadeTo(1, .9, function() {
			$(this).fadeTo(900, 0, function() {
				$(this).css('z-index', '-1');
			});
		})
	});
	window.loadTime = 1;
}


Score.prototype.callOut = function() {
	var i = 0;
	this.playerNotes = [];
	window.callIntervalId = setInterval(function() {
		// $(window[score.notes[i]].svg).fadeTo(799, 0.5, function() {
		// 	$(this).fadeTo(799, 1);
		// }); 
		fade(window[score.notes[i]]);	
		i++;
	}, 1520);
	setTimeout(function() {
		clearInterval(callIntervalId);
	}, 1520 * score.notes.length + 1510) // extra 1600 cuz setinterval is delayed
	window.measureId = window.setTimeout(
		function() { console.log(55);
		score.measure(false, true)}, 3100 * score.notes.length + 3200); // *1.5 because must wait for player's input
}

Score.prototype.measure = function(pressedKey, calledOut) {
	console.log(666);
	console.log(score.notes);
	console.log(score.playerNotes);
	// REMOVE THIS ^^ & THIS vv LATER
	if (this.notes.length === 1 && calledOut === false) {
		return;
	}
	if (pressedKey === true && this.playerNotes.length !== this.notes.length) {
		var isEquivalent = true;
		for (var i = 0; i < this.playerNotes.length; i++) {
			if (this.playerNotes[i] !== this.notes[i]) {
				isEquivalent = false;
			}
		}
		if (isEquivalent === true) {
			return;
		}
		else {
			clearTimeout(measureId);
			clearTimeout(callIntervalId);
		}
	}

	var isEquivalent = (this.playerNotes.length === this.notes.length);
	for (var i = 0; i < this.playerNotes.length; i++) {
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
	fontSmall(playButton.text);
	$('p.play-text').html('CORRECT').fadeTo(2000, 1, function() {
		fontLarge(playButton.text);
		$(this).html('PLAY');
	});
}

Score.prototype.unSync = function() {
	$('*').off();
	fontSmall(playButton.text);
	$('p.play-text').html('INCORRECT');
	$('.measures.one').html(String(this.measures));
	$('.measures.two').html('correct');
	$('.measures').css('z-index', '1');
	$('.measures').fadeTo(1000, .7, function() {
		$(this).fadeTo(50, .7, function() {
			$(this).fadeTo(1000, 0, function() {
				$(this).css('z-index', '-1');
				$('p.play-text').html('TRY AGAIN');
				$(playButton.svg).hover(playButton.hovered, playButton.unhovered);
				$(playButton.text).hover(playButton.hovered, playButton.unhovered);				
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
		currentSVG.querySelector('.key' + i + '-svg').style.fill = '#ffffff';
		currentSVG.querySelector('.bg' + i + '-svg').style.fill = 'rgb(' + genRGB() + ',' + genRGB() + ',' + genRGB() + ')';
	}
}

var initialize = function() {
	$('*').off();
	$(playButton.svg).off();
	$('div').remove();
	$('svg').hide();
	window.score = new Score();
}

window.loadTime = 1.5;
window.score = new Score();

