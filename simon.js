

function Key(keyName) {
	this.name = keyName;
	this.svg = currentSVG.querySelector('.' + keyName + '-svg');
	$(this.svg).attr('class', keyName + '-svg key');
	var pressedBound = this.pressed.bind(this);
	$(this.svg).click(pressedBound);
}

var fade = function(x) {
	$(x).fadeTo(799, 0.9, function() {
		$(this).fadeTo(799, 0);
	});
}

Key.prototype.pressed = function() {   // but why is "this" not the thing that calls "pressed"?
	fade($(this.svg));
	console.log(this.name);
	this.currScore.playerNotes.push(this.name); // score is a property of key... and vice versa

	if (this.currScore.playerNotes.length === this.currScore.notes.length) {
		clearTimeout(measureId);
	}
	this.currScore.measure(true);
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
	for (var i = 0; i < this.keyNumber; i++) {
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
	$('.measures').fadeTo(1200, .9, function() {
		$(this).fadeTo(1, .9, function() {
			$(this).fadeTo(900, 0, function() {
				$(this).css('z-index', '-1');
			});
		})
	});
}


Score.prototype.callOut = function() {
	var i = 0;
	var passThis = this;
	window.callIntervalId = setInterval(function() {
		// $(window[passThis.notes[i]].svg).fadeTo(799, 0.5, function() {
		// 	$(this).fadeTo(799, 1);
		// }); 
		fade($(window[passThis.notes[i]].svg));	
		i++;
	}, 1600);
	setTimeout(function() {
		clearInterval(callIntervalId);
	}, 1600 * passThis.notes.length + 1590) // extra 1600 cuz setinterval is delayed
	window.measureId = window.setTimeout(
		passThis.measure.bind(passThis), 2000 * passThis.notes.length + 3800); // *1.5 because must wait for player's input
}

Score.prototype.measure = function(pressedKey) {
	console.log(666);
	if (pressedKey === true && this.playerNotes.length !== this.notes.length) {
		var isEquivalent = true;
		for (var i = 0; i < this.playerNotes.length; i++) {
			if (this.playerNotes[i] !== this.notes[i]) {
				isEquivalent = false;
			}
		}
		if (isEquivalent === true) {
			return null;
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
	// currentSVG.querySelector('#playbutton-svg').style.fill = 'rgb(158,255,130)';
	// currentSVG.querySelector('.playbutton-svg').style.fill = 'rgb(190,255,200)';
	// currentSVG.querySelector('.membrane-svg').style.fill = 'rgb(230,255,255)';
}

var initialize = function() {
	$('*').off();
	$(playButton.svg).off();
	$('div').remove();
	$('svg').hide();
	window.score = new Score();
}

$('svg').hide();
window.score = new Score();

