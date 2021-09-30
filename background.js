// on tab load
chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete' || changeInfo.url) {
        get_domain_tags(); 
    }
  })

function printhello(){
    console.log("hello!");
}

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
        chrome.tabs.executeScript(tab.id, {
            file: "firebase-app.js"
        });
        chrome.tabs.executeScript(tab.id, {
            file: "firebase-firestore.js"
        });
        chrome.tabs.executeScript(tab.id, {
            file: "firebase.js"
        });
        chrome.tabs.query({active: true}, function(tabs) {
            var tab = tabs[0];
            tab_title = tab.title;
            chrome.tabs.executeScript(tab.id, {
            code: `document.querySelectorAll("cite").length`
            }, function(results) {
                numberOfSites = results;
                // Highlights all <cite> tags in red + add icons
                for (var i = 0; i < numberOfSites; i++) {
                    var id = chrome.runtime.id
                    // only add if it hasn't been added yet
                    chrome.tabs.executeScript(tab.id, {
                        code: ` 
                                var domain = String(document.querySelectorAll("cite")[${i}].textContent).split(" ")[0]; 
                                domain = domain.split(".");
                                domain = domain.at(-2) + "." + domain.at(-1);
                                if (domain.includes("//")) {
                                    domain = domain.split("//").at(-1);
                                }
                                if (domain.includes("/")) {
                                    domain = domain.split("/")[0];
                                }
                                console.log(String(domain));
                                check_website(String(domain)).then(rating => {
                                    //console.log(rating);
                                    var icon_path;
                                    switch (rating) {
                                        case -1:
                                            icon_path = 'cross_icon.png';
                                            break;
                                        case 0:
                                            icon_path = 'exclaim_icon.png';
                                            break;
                                        case 1:
                                            icon_path = 'tick_icon.png';
                                            break;
                                        default:
                                            icon_path = 'question_icon.png';
                                            break;
                                    }
                                    loaded = document.querySelectorAll(".icon_acrevus${i}").length != 0; 
                                    if (!loaded) { 
                                        //document.querySelectorAll("cite")[${i}].style.backgroundColor = "red";
                                        document.querySelectorAll("cite")[${i}].innerHTML += "<a href='javascript:;' class='icon_acrevus${i}' style='z-index:100000'><img src = chrome-extension:/${id}/img/" + String(icon_path) + " style='width:24px;height:24px;vertical-align: middle;margin-left:8px;'></button>"
                                        document.getElementsByClassName("icon_acrevus${i}")[0].addEventListener("click", ${printhello});
                                    } 
                                });
                                `
                    }, function(res) {
                        
                        //
                    });           
                }
            });
        });    
    });


 
    
   
    
}
