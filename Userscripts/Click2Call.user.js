// ==UserScript==
// @name         ELead CRM Click2Call Autocall
// @namespace    https://daytonrea.com/
// @version      1.2
// @description  Automatically clicks Call when Click2Calling from ELead CRM
// @author       Dayton Rea
// @match        www.eleadcrm.com/evo2/fresh/elead-v45/elead_track/ClickToCall/ProcessCall.aspx?Phone=*
// @downloadURL  https://daytonrea.com/Userscripts/Click2Call.user.js
// @updateURL    https://daytonrea.com/Userscripts/Click2Call.user.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=eleadcrm.com
// @grant        none
// ==/UserScript==

function runInPage(code) {
    const s = document.createElement('script');
    s.textContent = code;
    document.documentElement.appendChild(s);
    s.remove();
}

// Wait for full page load
window.addEventListener('load', () => {
    const CLICK_DELAY_MS = 500; // wait 2 seconds after button appears before clicking

    let clickTimeout = null;
    clickTimeout = setTimeout(() => {
                runInPage('var result = function() { btnCallClick(); return false; }.call();');
            }, CLICK_DELAY_MS);
});

(function() {
    const target = 'Our system is dialing you at';

    const observer = new MutationObserver(() => {
        if (document.body && document.body.innerText.includes(target)) {
            console.log('Detected dialing text. Closing window.');
            observer.disconnect();
            window.close();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
    });
})();
