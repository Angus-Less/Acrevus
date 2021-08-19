/**
 * All browser scraping related functions are here.
 * 
 * The following are required because of Chrome's Content Security Policy banning all inline scripts and event-functions.
 */
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('testButton').addEventListener('click', get_domain_tags);      
});

function sleep(ms) {
    /**
     * System timeout for the page.
     */
    return new Promise(resolve => setTimeout(resolve, ms));
  }

function get_domain_tags() {
    /**
     * Returns an array of all the domains in the HTML page the user is looking at.
     * 
     * Return:
     *      Array containing all websites listed on a given google search.
     */
     var tab_title = '';
     var currentPage = 0; // This should be incremented in states of 2 [0, 2, 4, etc...]
     //var numberOfSites = 20; // TODO: FIX THIS SO THAT WE CAN RE-ALLOCATE IT.
     var list_of_sites = [];

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
                alert(results);
                numberOfSites = results;
                alert(numberOfSites);
                
                // Exceute the script modification.
                for (var i = 0; i < numberOfSites; i++) {
                    chrome.tabs.executeScript(tab.id, {
                        code: `document.querySelectorAll("cite")[${i}].textContent`
                    }, function(results) {
                        // Modifies the extension's HTML.
                        document.getElementById('test').innerHTML += "<p>Domain list: "+ `${i} ` + results +"</p>";
                        
                        
                    }); }
            });
        });    
    });

    
}
