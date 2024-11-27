/*
Noah Rothgaber
02134094
noah_rothgaber@student.uml.edu


THANK YOU TO BROOKE MY WONDERFUL PARTNER FOR TRYING TO BREAK THIS CODE
*/
$(document).ready(function () {
    console.log("jQuery is ready");

    // Initialize tabs
    $("#tabs").tabs();

    // jQuery UI sliders for each input field
    function setupSlider(sliderId, inputId, min, max) {
        $(`#${sliderId}`).slider({
            min: min,
            max: max,
            step: 1,
            slide: function (event, ui) {
                $(`#${inputId}`).val(ui.value);
                generate_table(); // Dynamically update the table when the slider changes
            },
        });

        $(`#${inputId}`).on("input", function () {
            const val = parseInt($(this).val()); // get int from slider
            if (!isNaN(val) && val >= min && val <= max) {
                $(`#${sliderId}`).slider("value", val); // change text on slider
                generate_table(); // same as above but with the text boxes  
            }
        });
    }

    // Setup sliders for inputs
    setupSlider("sliderColumnLBound", "columnLBoundInput", -50, 50);
    setupSlider("sliderColumnUBound", "columnUBoundInput", -50, 50);
    setupSlider("sliderRowLBound", "rowLBoundInput", -50, 50);
    setupSlider("sliderRowUBound", "rowUBoundInput", -50, 50);

    // Validation and form submission through jquery validation, does well but was confusing at first
    $("#multiplicationForm").validate({
        rules: {
            columnLBound: { required: true, number: true, step: 1, range: [-50, 50] },
            columnUBound: { required: true, number: true, step: 1, range: [-50, 50] },
            rowLBound: { required: true, number: true, step: 1, range: [-50, 50] },
            rowUBound: { required: true, number: true, step: 1, range: [-50, 50] },
        },
        messages: {
            columnLBound: {
                required: "Please enter the lower bound for the columns.",
                number: "Must be a valid number.",
                step: "Only whole numbers are allowed.",
                range: "Value must be between -50 and 50.",
            },
            columnUBound: {
                required: "Please enter the upper bound for the columns.",
                number: "Must be a valid number.",
                step: "Only whole numbers are allowed.",
                range: "Value must be between -50 and 50.",
            },
            rowLBound: {
                required: "Please enter the lower bound for the rows.",
                number: "Must be a valid number.",
                step: "Only whole numbers are allowed.",
                range: "Value must be between -50 and 50.",
            },
            rowUBound: {
                required: "Please enter the upper bound for the rows.",
                number: "Must be a valid number.",
                step: "Only whole numbers are allowed.",
                range: "Value must be between -50 and 50.",
            },
        },
        errorPlacement: function (error, element) {
            // Add a custom class to the error message, WHICH WASN'T WORKING CAUSE I USED A # INSTEAD OF A PERIOD AGHHHHHHHHH
            error.addClass("error-message");
            error.insertAfter(element);
        },
        submitHandler: function (form) {
            createNewTab();
            return false;
        },
    });


    function generate_table() {
        // grab the appropriate values
        const colLower = parseInt($("#columnLBoundInput").val());
        const colUpper = parseInt($("#columnUBoundInput").val());
        const rowLower = parseInt($("#rowLBoundInput").val());
        const rowUpper = parseInt($("#rowUBoundInput").val());
        // check if actual number and do not continue if NAN
        if (isNaN(colLower) || isNaN(colUpper) || isNaN(rowLower) || isNaN(rowUpper)) return;
        // add error check to the page tabs when lower bounds are greater than upper
        if (colLower >= colUpper || rowLower >= rowUpper) {
            $("#entry-tab").html("<p style='color: red;'>Ensure lower bounds are less than upper bounds.</p>");
            return;
        }

        // Generate the actual table
        let tableHTML = '<table class="generatedTable"><tr><th></th>';
        for (let col = colLower; col <= colUpper; col++) {
            tableHTML += `<th style="color: green;">${col}</th>`; // Apply green style to column headers
        }
        tableHTML += "</tr>";
        for (let row = rowLower; row <= rowUpper; row++) {
            tableHTML += `<tr><th style="color: green;">${row}</th>`; // Apply green style to row headers, I somehow lost my blocky green style, not sure what happened
            for (let col = colLower; col <= colUpper; col++) {
                tableHTML += `<td>${row * col}</td>`;
            }
            tableHTML += "</tr>";
        }
        tableHTML += "</table>";

        // Update live table
        $("#entry-tab").html(tableHTML);
    }

    // I referenced this when debugging https://api.jqueryui.com/tabs/
    function createNewTab() {
        // make a new tab with the updated table assuming it was geberated properly
        const colLower = $("#columnLBoundInput").val();
        const colUpper = $("#columnUBoundInput").val();
        const rowLower = $("#rowLBoundInput").val();
        const rowUpper = $("#rowUBoundInput").val();
        const tabName = `(${colLower}, ${colUpper}, ${rowLower}, ${rowUpper})`;

        const tabId = `tab-${new Date().getTime()}`; // add an ID based on the time so I don't end up changing the attributes of all the tabs when I just wanna change one
        $("#tabs ul").append(`<li><a href="#${tabId}">${tabName}</a> <span class="ui-icon ui-icon-close" role="button"></span></li>`); // add close button with little x mark
        $("#tabs").append(`<div id="${tabId}">${$("#entry-tab").html()}</div>`);
        $("#tabs").tabs("refresh");

        $(".ui-icon-close").on("click", function () {
            const panelId = $(this).closest("li").remove().attr("aria-controls"); // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-controls
            $(`#${panelId}`).remove(); // remove the panel displaying the table
            $("#tabs").tabs("refresh"); // update the tabs so they don't show up on the page anymore
        });
    }

    $("#deleteAllTabs").on("click", function () {
        $("#tabs ul li:not(:first)").remove(); // remove all but the first tab header cause thats the one where you get the preview
        $("#tabs div:not(#entry-tab)").remove(); // remove the actual tab itself
        $("#tabs").tabs("refresh"); // refresh to show the deletion 
    });
});
