// ==UserScript==
// @name         Internet Sales Status GoToday Button
// @namespace    https://daytonrea.com/
// @version      1.0
// @description  Adds a "Go - Today" button that sets the date range to today, selects department 66870, and submits the report.
// @match        https://www.eleadcrm.com/evo2/fresh/elead-v45/elead_track/Reports/InternetSalesStatusReport.aspx
// @downloadURL  https://daytonrea.com/Userscripts/InternetSalesStatus.user.js
// @updateURL    https://daytonrea.com/Userscripts/InternetSalesStatus.user.js
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
  'use strict';

  // Utility: format Date -> MM/DD/YYYY
  function formatDateMMDDYYYY(d) {
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  }

  function triggerEvent(el, name) {
    if (!el) return;
    const ev = new Event(name, { bubbles: true, cancelable: true });
    el.dispatchEvent(ev);
  }

  function setDateInputsAndNotify(startVal, endVal) {
    const startInput = document.getElementById('DatePicker1_txtStartDate');
    const endInput = document.getElementById('DatePicker1_txtEndDate');

    if (startInput) {
      startInput.value = startVal;
      triggerEvent(startInput, 'input');
      triggerEvent(startInput, 'change');
    }
    if (endInput) {
      endInput.value = endVal;
      triggerEvent(endInput, 'input');
      triggerEvent(endInput, 'change');
    }

    // If the page has a DatePicker instance with Notify(), call it to ensure internal state updates.
    try {
      if (window.DatePicker1_DatePicker && typeof window.DatePicker1_DatePicker.Notify === 'function') {
        // small timeout to let the input/change events settle
        window.setTimeout(() => window.DatePicker1_DatePicker.Notify(), 10);
      }
    } catch (e) {
      // ignore
      console.warn('Go - Today userscript: DatePicker1_DatePicker.Notify() failed', e);
    }
  }

  function addGoTodayButton() {
    // Avoid adding twice
    if (document.getElementById('btnGoToday')) return;

    // Find existing "Go" button
    const goBtn = document.getElementById('btnViewReport') || document.querySelector("input[name='btnViewReport'], input#btnViewReport");
    if (!goBtn) {
      // If not yet present, try again shortly (page may render controls later)
      // Try a few times then give up.
      let attempts = 0;
      const ti = setInterval(() => {
        attempts++;
        const btn = document.getElementById('btnViewReport') || document.querySelector("input[name='btnViewReport'], input#btnViewReport");
        if (btn) {
          clearInterval(ti);
          // call again to insert
          addGoTodayButton();
        } else if (attempts > 10) {
          clearInterval(ti);
        }
      }, 200);
      return;
    }

    // Create "Go - Today" button
    const btnToday = document.createElement('input');
    btnToday.type = 'button';
    btnToday.id = 'btnGoToday';
    btnToday.value = 'Go - Today';

    // Apply classes/styles similar to existing Go button so it blends in
    try {
      btnToday.className = goBtn.className || 'textBlack getreport';
      btnToday.style.marginLeft = '6px';
      btnToday.style.cursor = 'pointer';
    } catch (e) {}

    // Click handler
    btnToday.addEventListener('click', function (ev) {
      ev.preventDefault();

      // Today's date
      const today = new Date();
      const dateStr = formatDateMMDDYYYY(today);

      // Set both start and end to today and notify DatePicker
      setDateInputsAndNotify(dateStr, dateStr);

      // Set department dropdown to value 66870
      const ddl = document.getElementById('ddlDepartments') || document.querySelector("select[name='ddlDepartments'], select#ddlDepartments");
      if (ddl) {
        ddl.value = '66870';
        triggerEvent(ddl, 'change');
      }

      // Small delay to let the DatePicker and dropdown change handlers run, then click Go
      window.setTimeout(() => {
        // If the page binds to input submit or checks drillDownSubmit, we can just call click()
        try {
          goBtn.click();
        } catch (e) {
          // fallback to form submit
          const form = document.getElementById('form1') || document.querySelector('form');
          if (form) form.submit();
        }
      }, 120);
    }, false);

    // Insert the button next to the existing Go button
    try {
      goBtn.parentNode.insertBefore(btnToday, goBtn.nextSibling);
    } catch (e) {
      // fallback: append to body
      document.body.appendChild(btnToday);
    }
  }

  // Run when DOM is ready (script is @run-at document-idle so typically fine)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addGoTodayButton);
  } else {
    addGoTodayButton();
  }
})();
