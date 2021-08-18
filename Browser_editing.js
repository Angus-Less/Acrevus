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
     var numberOfSites = 20; // TODO: FIX THIS SO THAT WE CAN RE-ALLOCATE IT.
     var list_of_sites = [];


    function get_length(length) {
        /**
         * Returns the length of the cites used on google search.
         */
        numberOfSites = Number(length);
        //alert(numberOfSites);
    }

    function display_h1(results) {
        /**
         * Modifies the inner html to show the website domains.
         */
        document.getElementById('test').innerHTML += "<p>Domain list: "+ `${currentPage} ` + results +"</p>";
        currentPage += 1;
    }


    //alert(numberOfSites);
     //Get the number of searches available.
    chrome.tabs.query({active: true}, function(tabs) {
        var tab = tabs[0];
        tab_title = tab.title;
        chrome.tabs.executeScript(tab.id, {
          code: `document.querySelectorAll("cite").length`
        }, get_length);
    });

    
    // Go through the page and get the cite tags from the google search.
    for (var i = 0; i < numberOfSites; i++) {
        chrome.tabs.query({active: true}, function(tabs) {
        var tab = tabs[0];
        tab_title = tab.title;
        chrome.tabs.executeScript(tab.id, {
            code: `document.querySelectorAll("cite")[${i}].textContent`
        }, display_h1);
        });    
    }
   
    // Main modification of the page update here.
    // for (var i = 0; i < list_of_sites.length; i++) {
    //     chrome.storage.local.get[i], function(result) {
    //         // Change the entry.
    //         document.getElementById('test').innerHTML += "<p>Domain list: " + result +"</p>";
    //     }
    // }
    
}
