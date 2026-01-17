// ==UserScript==
// @name         Add Direct Connect Checkbox to Process Activity
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Injects the "Direct Connect" checkbox span right after the span that contains the input with id="eveningnumber" on process_activity.html
// @match        https://www.eleadcrm.com/evo2/fresh/elead-v45/elead_track/eLeadToday/ProcessTask.asp*
// @match        https://www.eleadcrm.com/evo2/fresh/elead-v45/elead_track/eleadtoday/processtask.asp?*
// @downloadURL  https://daytonrea.com/Userscripts/DirectConnectCheckbox.user.js
// @updateURL    https://daytonrea.com/Userscripts/DirectConnectCheckbox.user.js
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const DIRECT_CONNECT_HTML = `<span style="white-space: nowrap">
        <input type="checkbox" id="directconnect" name="Direct Connect" onclick="doCommentClicks(localization.getTranslation('ProcessTask:(Direct Connect)'), this.checked, document.getElementById('Comments'), document.getElementById('dtCompleted'))"><span data-i18n="ProcessTask:Direct Connect">Direct Connect</span>
    </span>`;

    function insertDirectConnectAfterEvening() {
        // If directconnect already exists, do nothing
        if (document.getElementById('directconnect')) {
            return true;
        }

        const eveningInput = document.getElementById('eveningnumber');
        if (!eveningInput) {
            return false;
        }

        // Find the containing span for the eveningnumber input (closest ancestor <span>)
        const eveningSpan = eveningInput.closest('span') || eveningInput.parentElement;
        if (!eveningSpan || !eveningSpan.parentNode) {
            return false;
        }

        // Create element from HTML and insert after the evening span
        const container = document.createElement('div');
        container.innerHTML = DIRECT_CONNECT_HTML;
        const newSpan = container.firstElementChild;
        eveningSpan.parentNode.insertBefore(newSpan, eveningSpan.nextSibling);

        // Optional: log success
        console.log('Direct Connect checkbox inserted after #eveningnumber span.');
        return true;
    }

    // Try immediate insertion (if element already present)
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        if (!insertDirectConnectAfterEvening()) {
            // If insertion failed because target not present yet, observe for DOM changes
            const observer = new MutationObserver((mutations, obs) => {
                if (insertDirectConnectAfterEvening()) {
                    obs.disconnect();
                }
            });
            observer.observe(document.documentElement || document.body, { childList: true, subtree: true });
        }
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            if (!insertDirectConnectAfterEvening()) {
                const observer = new MutationObserver((mutations, obs) => {
                    if (insertDirectConnectAfterEvening()) {
                        obs.disconnect();
                    }
                });
                observer.observe(document.documentElement || document.body, { childList: true, subtree: true });
            }
        }, { once: true });
    }
})();
