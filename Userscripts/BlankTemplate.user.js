// ==UserScript==
// @name         Choose Blank Salesperson Template on eLeads
// @namespace    https://daytonrea.com
// @version      1.2
// @description  Select option with value 962080 inside optgroup "Global" on eleadcrm templates.asp
// @match        https://www.eleadcrm.com/evo2/fresh/elead-v45/elead_track/weblink/templates.asp*
// @downloadURL  https://daytonrea.com/Userscripts/BlankTemplate.user.js
// @updateURL    https://daytonrea.com/Userscripts/BlankTemplate.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', () => {
        // Find the optgroup with label "Global"
        const optgroup = Array.from(document.querySelectorAll('optgroup'))
            .find(g => g.label && g.label.trim().toLowerCase() === 'global');

        if (!optgroup) {
            console.log("⚠️ Optgroup labeled 'Global' not found.");
            return;
        }

        // Find the option with value="962080" inside that optgroup
        const option = optgroup.querySelector('option[value="962080"]');
        if (!option) {
            console.log("⚠️ Option with value 962080 not found in 'Global' optgroup.");
            return;
        }

        // Select it
        const select = optgroup.closest('select');
        if (select) {
            select.value = "962080";
            select.dispatchEvent(new Event('change', { bubbles: true }));
            console.log("✅ Option 962080 in 'Global' optgroup selected.");
        } else {
            console.log("⚠️ Parent <select> element not found.");
        }
    }, { once: true }); // Ensures it only runs once
})();
