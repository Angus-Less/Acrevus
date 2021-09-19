// on tab load
chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete') {
        get_domain_tags(); 
    }
  })

// duplicate code ftw
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
                
                numberOfSites = results;

                // Highlights all <cite> tags in red + add images
                for (var i = 0; i < numberOfSites; i++) {
                    var id = chrome.runtime.id
                    chrome.tabs.executeScript(tab.id, {
                        code: `document.querySelectorAll("cite")[${i}].style.backgroundColor = "red";
                        document.querySelectorAll("cite")[${i}].innerHTML += "<img src = chrome-extension://${id}/img/cross_icon.png style='width:32px;height:32px;'>"`
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
