//=============================================================================
//  MuseScore
//  Music Score Editor
//
//  Crescendo and Diminuendo plugin
//
//	Creates note velocities for crescendos and diminuendos
//	Version 0.2 - 2011
//
//	By Tory Gaurnier, 2011
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

function setDynamics() {
	messageBox = new QMessageBox();
	messageBox.setWindowTitle("Message Box");
	
	var cursor = new Cursor(curScore);
	var selectionEnd = new Cursor(curScore);
	var numberOfChords = 0;
	var startingVelocity = 0;
	var endingVelocity = 0;
	var increment = 0;

	cursor.goToSelectionStart();
	selectionEnd.goToSelectionEnd();

//Find how many notes/chords are in selection
	while(cursor.tick() < selectionEnd.tick()) {
		if(cursor.isChord()) {
			numberOfChords++;
		}
		cursor.next();
	}
	
//Get starting and ending velocities
	cursor.goToSelectionStart();
	for(var i = 1; i <= numberOfChords; i++) {
	
		if(i == 1) {
			if(cursor.isChord()) {
				startingVelocity = cursor.chord().note(0).velocity;
			}
		}
		if(i == numberOfChords) {
			if(cursor.isChord()) {
				endingVelocity = cursor.chord().note(0).velocity;
			}
		}
		cursor.next();
		while(!cursor.isChord()) {cursor.next();}
	}

//Set increment value
	if(Math.round((endingVelocity - startingVelocity) / numberOfChords) == 0) {
		increment = 1;
	}
	else {
		increment = Math.round((endingVelocity - startingVelocity) / numberOfChords);
	}

//Set velocity to notes
	
cursor.goToSelectionStart();
	for(var i = 1; i <= numberOfChords; i++) {
		while(!cursor.isChord()) {cursor.next();}
		if(cursor.isChord()) {
			var chord = cursor.chord();
			var n = chord.notes;
			for(var I = 0; I < n; I++) {
				if(i != 1 && i != numberOfChords) {
					note = chord.note(I);
					note.velocity = startingVelocity + (increment * i);
				}
			}
		}
		cursor.next();
	}
}

function init() {

}
function run() {
	setDynamics();
};
function close() {

};

mscorePlugin = {
	majorVersion: 1.1,
	minorVersion: 1.1,
	menu: 'Plugins.Create Crescendo or Diminuendo',
	init: init,
	run: run,
	onClose: close
};
mscorePlugin;
/**
//read the UI file and create a form out of it
var loader = new QUiLoader(null);
var file = new QFile(pluginPath + "/crescendo or diminuendo.ui");
file.open(QIODevice.OpenMode(QIODevice.ReadOnly, QIODevice.Text));
form = loader.load(file, null);

//initialize some widget value if necessary
form.verticalLayoutWidget.myLabel.text = curScore.title;
form.verticalLayoutWidget.myLabel2.text = curScore.composer;

//connect signal
form.searchBtn.clicked.connect(doSomething);
form.closeBtn.clicked.connect(close);

//show the form
form.show();*/
