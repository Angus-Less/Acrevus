/**
 * All browser scraping related functions are here.
 * 
 * The following are required because of Chrome's Content Security Policy banning all inline scripts and event-functions.
 */

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('testButton').addEventListener('click', get_domain_tags);      
});

/**
 * System timeout for the page.
 * 
 * Return:
 *      Promise giving a resolve of a timeour for the page.
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


/**
 * Returns an array of all the domains in the HTML page the user is looking at.
 * 
 * Return:
 *      Array containing all websites listed on a given google search.
 */
function get_domain_tags() {
     var tab_title = '';

    //Get the number of searches available.
    // Go through the page and get the cite tags from the google search.
    
    chrome.tabs.query({active: true}, function(tabs) {
        var tab = tabs[0];
        tab_title = tab.title;
        var numberOfSites = 0;
        chrome.tabs.query({active: true}, function(tabs) {
            var tab = tabs[0];
            tab_title = tab.title;
            chrome.tabs.executeScript(tab.id, {
            code: `document.querySelectorAll("cite").length`
            }, function(results) {
                
                numberOfSites = results;

                // Highlights all <cite> tags in red.
                for (var i = 0; i < numberOfSites; i++) {
                    chrome.tabs.executeScript(tab.id, {
                        code: `document.querySelectorAll("cite")[${i}].style.backgroundColor = "red"`
                    }, function(results) {
                        // Do nothing but specify callback function.
                    }); 
                }

                // Exceute the script modification.
                for (var i = 0; i < numberOfSites; i++) {
                    if (i % 2 == 0 || i == 0) {
                        chrome.tabs.executeScript(tab.id, {
                            code: `document.querySelectorAll("cite")[${i}].textContent`
                        }, function(results) {
                            // Modifies the extension's HTML.
                            let subDomain = String(results).split(" ")[0]
                            document.getElementById('test').innerHTML += "<p>Domain list: "+ `${i} ` + subDomain +"</p>";
                        }); 
                    }
                    
                }
            });
        });    
    });
}
