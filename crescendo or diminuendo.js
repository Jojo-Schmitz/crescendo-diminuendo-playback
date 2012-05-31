//=============================================================================
//  MuseScore
//  Music Score Editor
//
//  Crescendo and Diminuendo plugin
//
//	Creates note velocities for crescendos and diminuendos
//	Version 0.4 - 2012
//
//	By Tory Gaurnier, 2011
//	By Joachim Schmitz, 2012
//
//  MuseScore: Copyright (C)2008 Werner Schweer and others
//
//  This program is free software; you can redistribute it and/or modify
//  it under the terms of the GNU General Public License version 2.
//
//  This program is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU General Public License for more details.
//
//  You should have received a copy of the GNU General Public License
//  along with this program; if not, write to the Free Software
//  Foundation, Inc., 675 Mass Ave, Cambridge, MA 02139, USA.
//=============================================================================

function init() {
};

function run() {
	// no score open (MuseScore 2.0+, can't happen earlier)
	if (typeof curScore === 'undefined')
		return;
	// MuseScore version too old
	else if (mscoreVersion < 10100) {
		messageBox = new QMessageBox();
		messageBox.setWindowTitle("Message Box");
		messageBox.text = "Sorry, but you need MuseScore version 1.1 or higher to use this plugin, please update.";
		messageBox.exec();
		return;
	}

	var cursor = new Cursor(curScore);
	var selectionEnd = new Cursor(curScore);
	var numberOfChords = 0;
	var startingVelocity = 0;
	var endingVelocity = 0;
	var increment = 0;

	cursor.goToSelectionStart();
	selectionEnd.goToSelectionEnd();

	// Find how many notes/chords are in the selection
	while (cursor.tick() < selectionEnd.tick()) {
		if (cursor.isChord()) {
			numberOfChords++;
			// Get starting and ending velocities
			if (startingVelocity == 0)
				startingVelocity = cursor.chord().note(0).velocity;
			endingVelocity = cursor.chord().note(0).velocity;
		}
		cursor.next();
	}
	
	// Nothing to do
	if (numberOfChords == 0)
		return;

	// Calculate increment value
	increment = (endingVelocity - startingVelocity) / numberOfChords;

	// Set velocity to all notes of all chords
	cursor.goToSelectionStart();
	for (var c = 1; c <= numberOfChords; c++) {
		while (!cursor.isChord())
			cursor.next();
		if (c != 1 && c != numberOfChords) {
			for (var n = 0; n < cursor.chord().notes; n++) {
				cursor.chord().note(n).velocity = startingVelocity + Math.round(increment * c);
			}
		}
		cursor.next();
	}
};

function close() {
};

mscorePlugin = {
	majorVersion: 1,
	minorVersion: 1,
	menu: 'Plugins.Create Crescendo or Diminuendo',
	init: init,
	run: run,
	onClose: close
};

mscorePlugin;
