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

import QtQuick 2.0
import MuseScore 1.0

MuseScore {
   version: "0.9"
   description: "This plugin creates note velocities for crescendo and diminuendo"
   menuPath: 'Plugins.Create Crescendo or Diminuendo'

   onRun: {
      if (typeof curScore === 'undefined')
         Qt.quit();

      var cursor = curScore.newCursor();
      var selectionEnd = curScore.newCursor();

      cursor.rewind(1); // start of selection
      selectionEnd.rewind(2); // end of selection

      var startTrack = cursor.track;
      var endTrack   = selectionEnd.track;

      // for all tracks (staves and voices) in selection
      for (var track = startTrack; track < endTrack; track++) {
         var numberOfChords = 0;
         var startingVelocity = 0;
         var endingVelocity = 0;

         // Find how many notes/chords are in the selection
         cursor.rewind(1); // start of selection

         while (cursor.segment) { //?
         //while (cursor.tick < selectionEnd.tick) {
            if (cursor.element && cursor.element.type == Element.CHORD) {
               numberOfChords++;
               // Get starting and ending velocities
               if (startingVelocity == 0)
                  startingVelocity = cursor.element.notes[0].veloOffset;
               endingVelocity = cursor.element.notes[0].veloOffset;
            }
            cursor.next();
         }

console.log("startingVelocity: " + startingVelocity);
console.log("endingVelocity: " + endingVelocity);
console.log("numberOfChords: " + numberOfChords);
         // Nothing to do for this voice
         if (numberOfChords <= 2)
            continue;

         // Calculate increment/decrement value
         var inc = (endingVelocity - startingVelocity) / (numberOfChords -1);
console.log("inc: " + inc);

         // Set velocity to all notes of all chords
         cursor.rewind(1); // Start of selection

         for (var c = 1; c < numberOfChords; c++) { // End befor last chord
            while (cursor.element && cursor.element.type != Element.CHORD)
               cursor.next();

            if (c != 1) { // Skip 1st chord
               for (var n = 0; n < cursor.element.notes; n++) {
                  cursor.element.notes[n].veloOffset = startingVelocity
                                                     + Math.round(inc * (c-1));
console.log("setting velocity to: " + cursor.element.notes[n].veloOffset);
               } // note loop
            } 
            cursor.next();
         } // chord loop 
      } // track loop

      Qt.quit();
   }
}
