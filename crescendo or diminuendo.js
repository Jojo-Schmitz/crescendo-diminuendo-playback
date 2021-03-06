//=============================================================================
//  MuseScore
//  Music Score Editor
//
//  Crescendo and Diminuendo plugin
//
//   Creates note velocities for crescendos and diminuendos
//   Version 0.9 - 2014
//
//   By Tory Gaurnier, 2011
//   By Joachim Schmitz, 2012-2014
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

// Set to true, if you want this plugin to color all notes blue it changed 
// velocity on. Use the blacknotes plugin to turn them black as needed
var colorit = false; 

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

   // real work can start...
   var cursor = new Cursor(curScore);
   var selectionEnd = new Cursor(curScore);
   
   cursor.goToSelectionStart();
   selectionEnd.goToSelectionEnd();

   var startStaff = cursor.staff;
   var endStaff   = selectionEnd.staff;

   curScore.startUndo();
   // for all staves in selection
   for (var staff = startStaff; staff < endStaff; staff++) {
      // and all voices in staff
      for (var voice = 0; voice < 4; voice++) {
         var numberOfChords = 0;
         var startingVelocity = 0;
         var endingVelocity = 0;

         // Find how many notes/chords are in the selection
         cursor.goToSelectionStart();
         cursor.voice = voice; // voice has to be set after goTo
         cursor.staff = staff; // staff has to be set after goTo

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
   
         // Nothing to do for this voice
         if (numberOfChords <= 2)
            continue; // Over to next voice

         // Calculate increment/decrement value
         var inc = (endingVelocity - startingVelocity) / (numberOfChords - 1);

         // Set velocity to all notes of all chords
         cursor.goToSelectionStart();
         cursor.voice = voice; // voice has to be set after goTo
         cursor.staff = staff; // staff has to be set after goTo

         for (var c = 1; c < numberOfChords; c++) { // End before last chord
            while (!cursor.isChord())
               cursor.next();

            if (c != 1 ) { // Skip 1st chord
               for (var n = 0; n < cursor.chord().notes; n++) {
                  cursor.chord().note(n).velocity = startingVelocity
                                                  + Math.round(inc * (c-1));
                  if (colorit)
                     cursor.chord().note(n).color= new QColor(26,12,255); // blue
               } // note loop
            } 
            cursor.next();
         } // chord loop 
      } // voice loop
   } // staff loop
   curScore.endUndo();
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
