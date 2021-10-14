// on tab load
chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete' || changeInfo.url) {
        get_domain_tags(); 
    }
  })


// TODO:  3. Display Other stuff. 4. make it look sexc. 5. Only one window can be open at a time?
function display_window(evt) {

    function close_window(evt) {
        idd = evt.currentTarget.id;
        console.log("IDDD:" + String(idd));
        if (document.querySelectorAll('.popup_acrevus'+String(idd)).length > 0) {
            console.log("YEEEEEEEEEEEEEEET");
            document.querySelectorAll('.popup_acrevus'+String(idd))[0].outerHTML = "";
        }
    }
    
    var id = evt.currentTarget.id;
    console.log(id);
    var clicked = document.getElementsByClassName("popup_acrevus"+String(id)).length != 0;
    console.log("clicked:" + String(clicked));
    site = String(evt.currentTarget.domain);
    console.log(site);
    //check_website(String(domain)).then(rating => {
    check_website_gpt(site).then(summary => {
        if (!clicked) {
            other_popups = document.querySelectorAll('[class^="popup_acrevus"]')
            for (k = 0; k < other_popups.length; k++) {
                other_popups[k].outerHTML = "";
            }
            if (summary == null) {
                document.querySelectorAll('.icon_acrevus'+String(id))[0].innerHTML += "<div class='popup_acrevus"+String(id) + "' style='background-color: white; width:200px; \
            height:250px; position:relative;left:600px;top:-30px' z-index:100001> \
            <img src = chrome-extension:/"+String(chrome.runtime.id)+"/img/close_window.png class='acrevus_close' style='height:25px;width:25px;position:relative;left:175px;'></img>\
            <img src = chrome-extension:/"+String(chrome.runtime.id)+"/img/thumbs_up.png class='acrevus_upvote' style='height:25px;width:25px;position:relative;left:10px;'></img>(Summary Unavailable) </div>"
            } else {
                document.querySelectorAll('.icon_acrevus'+String(id))[0].innerHTML += "<div class='popup_acrevus"+String(id) + "' style='background-color: white; width:200px; \
            height:250px; position:relative;left:600px;top:-30px' z-index:100001> \
            <img src = chrome-extension:/"+String(chrome.runtime.id)+"/img/close_window.png class='acrevus_close' style='height:25px;width:25px;position:relative;left:175px;'></img>\
            <img src = chrome-extension:/"+String(chrome.runtime.id)+"/img/thumbs_up.png class='acrevus_upvote' style='height:25px;width:25px;position:relative;left:10px;'></img>" + summary + "</div>"
            }
            const tmp1 = document.getElementsByClassName("icon_acrevus" + String(id))[0];
            tmp1.id = String(id);
            tmp1.addEventListener("click", close_window, false);
            log_user_entry(site, -1);
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
