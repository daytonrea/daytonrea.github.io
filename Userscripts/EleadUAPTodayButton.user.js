// ==UserScript==
// @name         Add "Today" Button to User Activity Performance
// @namespace    https://daytonrea.com
// @version      1.6
// @description  Adds "Today" and "Weekly" buttons to the custom report to set start/end dates (today: midnight->now, weekly: Monday midnight->now)
// @match        https://www.eleadcrm.com/evo2/fresh/elead-v45/elead_track/reports/customReport.aspx?ID=*
// @match        https://www.eleadcrm.com/evo2/fresh/elead-v45/elead_track/reports/customreport.aspx?ID=*
// @downloadURL  https://daytonrea.com/Userscripts/EleadUAPTodayButton.user.js
// @updateURL    https://daytonrea.com/Userscripts/EleadUAPTodayButton.user.js
// @match        https://crm.connectcdk.com/evo2/fresh/elead-v45/elead_track/reports/customreport.aspx?ID=*
// @match        https://crm.connectcdk.com/evo2/fresh/elead-v45/elead_track/reports/customReport.aspx?ID=*
// @grant        none
// ==/UserScript==


(function() {
    'use strict';

    // Utility for date formatting in "MM/DD/YYYY hh:mm:ss a"
    function formatDotNetDate(date) {
        function pad(n) { return n < 10 ? "0" + n : n; }

        let hours = date.getHours();
        let ampm = hours >= 12 ? "PM" : "AM";
        let hour12 = hours % 12;
        if(hour12 === 0) hour12 = 12;

        return [
            pad(date.getMonth() + 1), "/", pad(date.getDate()), "/", date.getFullYear(), " ",
            pad(hour12), ":", pad(date.getMinutes()), ":", pad(date.getSeconds()), " ", ampm
        ].join('');
    }

    function tryInsertButton() {
        let calendarContainer = document.getElementById('react_calendar_container');
        if (!calendarContainer) return false;

        // Find the MTD button
        let buttons = Array.from(calendarContainer.querySelectorAll('button'));
        let mtdButton = buttons.find(btn =>
            /MTD/i.test(btn.textContent)
        );

        // If not found, fallback to inserting at the start
        let insertAfter = mtdButton || buttons[0];

        // Prevent duplicate buttons when both already exist
        let hasToday = !!calendarContainer.querySelector('button#todayCustomButtonElead');
        let hasWeekly = !!calendarContainer.querySelector('button#weeklyCustomButtonElead');
        if (hasToday && hasWeekly) return true;

        // Helper to find GO button and click it
        function clickRunReport() {
            let goBtn = document.getElementById('btnRunReport');
            if(!goBtn) {
                // Fallback to searching for a submit button in the same form
                let form = calendarContainer.closest('form') || document.querySelector('form');
                if(form) {
                    goBtn = form.querySelector('input[type=submit],button[type=submit]');
                }
            }
            if(goBtn) {
                goBtn.click();
            }
        }

        // Create new "Today" button if missing
        let todayBtn = calendarContainer.querySelector('button#todayCustomButtonElead');
        if (!hasToday) {
            todayBtn = document.createElement('button');
            todayBtn.id = 'todayCustomButtonElead';
            todayBtn.type = 'button';
            todayBtn.className = insertAfter ? insertAfter.className : '';
            todayBtn.textContent = 'Today';

            todayBtn.addEventListener('click', function() {
                let now = new Date();
                let startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
                let formattedStart = formatDotNetDate(startOfDay);
                let formattedEnd = formatDotNetDate(now);

                let startInput = document.getElementById('datePickerStartDate');
                let endInput = document.getElementById('datePickerEndDate');
                if (startInput) startInput.value = formattedStart;
                if (endInput) endInput.value = formattedEnd;

                // Update visible react calendar textboxes if present
                let textInputs = calendarContainer.querySelectorAll('input');
                if(textInputs.length === 2) {
                    textInputs[0].value = formattedStart;
                    textInputs[1].value = formattedEnd;
                    textInputs[0].dispatchEvent(new Event('input', {bubbles:true}));
                    textInputs[1].dispatchEvent(new Event('input', {bubbles:true}));
                }
                todayBtn.style.background = '#b7dbff';
                setTimeout(()=>{ todayBtn.style.background=''; }, 500);

                clickRunReport();
            });

            // Insert the Today button immediately after the MTD button (or first button if MTD not found)
            if (insertAfter && insertAfter.nextSibling) {
                insertAfter.parentNode.insertBefore(todayBtn, insertAfter.nextSibling);
            } else if (insertAfter) {
                insertAfter.parentNode.appendChild(todayBtn);
            } else {
                // If no buttons found, append at the end
                calendarContainer.appendChild(todayBtn);
            }
        }

        // Create new "Weekly" button if missing
        if (!hasWeekly) {
            let weeklyBtn = document.createElement('button');
            weeklyBtn.id = 'weeklyCustomButtonElead';
            weeklyBtn.type = 'button';
            // Match the class of the Today button if available, otherwise insertAfter
            weeklyBtn.className = (todayBtn && todayBtn.className) ? todayBtn.className : (insertAfter ? insertAfter.className : '');
            weeklyBtn.textContent = 'Weekly';

            weeklyBtn.addEventListener('click', function() {
                let now = new Date();
                // Calculate Monday of current week (Monday = start). JS getDay(): 0=Sun,1=Mon,...6=Sat
                let day = now.getDay();
                let daysSinceMonday = (day + 6) % 7; // Monday -> 0, Sunday -> 6
                let startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysSinceMonday, 0, 0, 0);

                let formattedStart = formatDotNetDate(startOfWeek);
                let formattedEnd = formatDotNetDate(now);

                let startInput = document.getElementById('datePickerStartDate');
                let endInput = document.getElementById('datePickerEndDate');
                if (startInput) startInput.value = formattedStart;
                if (endInput) endInput.value = formattedEnd;

                // Update visible react calendar textboxes if present
                let textInputs = calendarContainer.querySelectorAll('input');
                if(textInputs.length === 2) {
                    textInputs[0].value = formattedStart;
                    textInputs[1].value = formattedEnd;
                    textInputs[0].dispatchEvent(new Event('input', {bubbles:true}));
                    textInputs[1].dispatchEvent(new Event('input', {bubbles:true}));
                }
                weeklyBtn.style.background = '#b7dbff';
                setTimeout(()=>{ weeklyBtn.style.background=''; }, 500);

                clickRunReport();
            });

            // Insert Weekly after the Today button if present, otherwise after insertAfter
            let placeAfter = todayBtn || insertAfter;
            if (placeAfter && placeAfter.nextSibling) {
                placeAfter.parentNode.insertBefore(weeklyBtn, placeAfter.nextSibling);
            } else if (placeAfter) {
                placeAfter.parentNode.appendChild(weeklyBtn);
            } else {
                calendarContainer.appendChild(weeklyBtn);
            }
        }

        return true;
    }

    // Run attempt when DOM is ready (since Elead may render calendar after page load)
    function runWhenReady() {
        if(tryInsertButton()) return;
        let attempts = 0;
        let interval = setInterval(() => {
            if(tryInsertButton() || ++attempts > 20) clearInterval(interval);
        }, 500);
    }

    if(document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(runWhenReady, 600);
    } else {
        window.addEventListener('DOMContentLoaded', runWhenReady);
    }
})();
