// on tab load
chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete' || changeInfo.url) {
        get_domain_tags(); 
    }
  })

// TODO: 1. Button to close window. 2. Display gpt summary. 3. Display Other stuff. 4. make it look sexc. 5. Only one window can be open at a time?
function display_window(evt) {
    var id = evt.currentTarget.id;
    console.log(id);
    site = String(evt.currentTarget.domain);
    console.log(site);
    //check_website(String(domain)).then(rating => {
    check_website_gpt(site).then(summary => {
        if (summary == null) {
            document.querySelectorAll('.icon_acrevus'+String(id))[0].innerHTML += "<div id='popup_acrevus"+String(id) + "' style='background-color: black; width:250px; \
        height:300px; position:relative;left:600px;top:-30px;z-index: 9999;a'>" + "<h1 style='color:white'>(Summary Unavailable)</h1>" + "</div>"
        } else {
            document.querySelectorAll('.icon_acrevus'+String(id))[0].innerHTML += "<div id='popup_acrevus"+String(id) + "' style='background-color: black; width:200px; \
        height:300px; position:relative;left:600px;top:-30px;z-index: 9999;a'>" + "<p style='color:white;font-size:10px'>" + summary + "</p>" + "</div>"
        }
    });
    //console.log("hello!");
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
                var domains = [];
                var id = chrome.runtime.id;
                chrome.tabs.executeScript(tab.id, {
                    code: ` 
                            var domains_2 = [];
                            for (i = 0; i < ${numberOfSites}; i++) {
                                domain = String(document.querySelectorAll("cite")[i].textContent).split(" ")[0]; 
                                domain = domain.split(".");
                                domain = domain.at(-2) + "." + domain.at(-1);
                                if (domain.includes("//")) {
                                    domain = domain.split("//").at(-1);
                                }
                                if (domain.includes("/")) {
                                    domain = domain.split("/")[0];
                                }
                                domains_2[i] = domain;
                            }
                            domains_2;
                        `
                }, function(results2) {
                    domains = results2[0];
                    for (j = 0; j < domains.length; j++) {
                        domains[j] = '"' + domains[j] + '"';
                    }
                    for (var i = 0; i < numberOfSites; i++) {
                        chrome.tabs.executeScript(tab.id, {
                            code: `
                                    domain = [${domains}][${i}];
                                    console.log("DOMAIN: " + domain);
                                    check_website(String(domain)).then(rating => {
                                        console.log("RATING: " + String(rating));
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
                                        console.log("LOADED:" + loaded);
                                        if (!loaded) { 
                                            //document.querySelectorAll("cite")[${i}].style.backgroundColor = "red";
                                            document.querySelectorAll("cite")[${i}].innerHTML += "<a href='javascript:;' class='icon_acrevus"+String(${i})+"' style='z-index:100000'><img src = chrome-extension:/${id}/img/" + String(icon_path) + " style='width:24px;height:24px;vertical-align: middle;margin-left:8px;'></button>"
                                            const tmp1 = document.getElementsByClassName("icon_acrevus" + String(${i}))[0];
                                            tmp1.id = ${i};
                                            tmp1.domain = [${domains}][${i}];
                                            tmp1.addEventListener("click", ${display_window}, false);
                                        } 
                                    });
                                `
                            }, function(ree) {});
                    };
                });
                   
            });
        });    
    });


 
    
   
    
}
