// ==UserScript==
// @name         Move Task to Bottom of Organizer Button
// @namespace    https://daytonrea.com
// @version      1.0
// @description  Adds a quick button to set time to 11:45 PM
// @author       Dayton Rea
// @match        https://www.eleadcrm.com/evo2/fresh/elead-v45/elead_track/eleadtoday/UpdateTask.asp?*
// @match        https://crm.connectcdk.com/evo2/fresh/elead-v45/elead_track/eleadtoday/UpdateTask.asp?*
// @downloadURL  https://daytonrea.com/Userscripts/MoveTasktoBottomofOrganizer.js
// @updateURL    https://daytonrea.com/Userscripts/MoveTasktoBottomofOrganizer.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    // Wait for DOM to be ready
    function waitForElement(selector, callback, timeout = 5000) {
        const startTime = Date.now();
        const interval = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(interval);
                callback(element);
            } else if (Date.now() - startTime > timeout) {
                clearInterval(interval);
                console.warn(`Element ${selector} not found within ${timeout}ms`);
            }
        }, 100);
    }

    waitForElement('select[name="szAMPM"]', function(ampmSelect) {
        // Create button
        const button = document.createElement('button');
        button.id = 'quickTimeButton';
        button.type = 'button';
        button.title = 'Set time to 11:45 PM';
        button.style.cssText = `
            width: 24px;
            height: 24px;
            padding: 2px;
            margin-left: 5px;
            background-color: #039BE5;
            border: 1px solid #039BE5;
            border-radius: 4px;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 16px;
            line-height: 1;
            vertical-align: middle;
        `;

        // Create down arrow icon (using Unicode)
        button.innerHTML = '▼';

        // Add click handler
        button.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector('select[name="nHrs"]').value = '11';
            document.querySelector('select[name="nMin"]').value = '45';
            document.querySelector('select[name="szAMPM"]').value = 'PM';
        });

        // Insert button after szAMPM select
        ampmSelect.parentNode.insertBefore(button, ampmSelect.nextSibling);
    });
})();
