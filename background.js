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
            document.querySelectorAll('.yes_btn'+String(idd))[0].outerHTML = "";
            document.querySelectorAll('.no_btn'+String(idd))[0].outerHTML = "";
            document.querySelectorAll('.star'+String(idd))[0].outerHTML = "";
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
            yes_btns = document.querySelectorAll('[class^="yes_btn"]')
            no_btns = document.querySelectorAll('[class^="no_btn"]')
            star_btns = document.querySelectorAll('[class^="star"]')
            for (k = 0; k < other_popups.length; k++) {
                other_popups[k].outerHTML = "";
                yes_btns[k].outerHTML = "";
                no_btns[k].outerHTML = "";
                star_btns[k].outerHTML = "";
            }

            var thumb_up = null;
            var thumb_down = null;

            var res_promise = get_site_user_rating(site);
            res_promise.then(
                function(res) {
                    console.log('thumb up in background: ', res[0])
                    thumb_up = res[0]
                    console.log('thumb down in background: ', res[1])
                    thumb_down = res[1]
                    var string = null
                    if (thumb_up === -666) {
                        string = "User rating is unavailable for this website."
                    } else {
                        var stars = (thumb_up/(thumb_up + thumb_down) * 5).toFixed(2)
                        string = "Out of " + (thumb_up + thumb_down) + " ratings, " + site + " was rated " + stars + " out of 5."
                    }
                    if (summary == null) {
                        document.querySelectorAll('.icon_acrevus'+String(id))[0].innerHTML += "<div class='popup_acrevus"+String(id) + "' style='background-image: url(\"chrome-extension:" + String(chrome.runtime.id) + "/img/window.png\"); width:270px; \
                    height:446px; position:relative;left:600px;top:-30px;z-index:9999;' > \
                    (Summary Unavailable). " + string + "</div>"
                        document.querySelectorAll('.icon_acrevus'+String(id))[0].outerHTML += "<div class='yes_btn"+String(id) + "' style='background-image: url(\"chrome-extension:" + String(chrome.runtime.id) + "/img/yes_button.png\"); width:120px; \
                        height:28px; position:relative;left:610px;top:-204px;z-index:9999' ></div>"
                        document.querySelectorAll('.icon_acrevus'+String(id))[0].outerHTML += "<div class='no_btn"+String(id) + "' style='background-image: url(\"chrome-extension:" + String(chrome.runtime.id) + "/img/no_button.png\"); width:120px; \
                        height:28px; position:relative;left:740px;top:-176px;z-index:9999' ></div>"
                        document.querySelectorAll('.icon_acrevus'+String(id))[0].outerHTML += "<div class='star"+String(id) + "' style='background-image: url(\"chrome-extension:" + String(chrome.runtime.id) + "/img/full_star.png\"); width:35px; \
                        height:32px; position:relative;left:640px;top:-305px;z-index:9999;background-size: 35px;' ></div>"
                    } else { 
                        document.querySelectorAll('.icon_acrevus'+String(id))[0].innerHTML += "<div class='popup_acrevus"+String(id) + "' style='background-image: url(\"chrome-extension:" + String(chrome.runtime.id) + "/img/window.png\"); width:270px; \
                    height:446px; position:relative;left:600px;top:-30px;z-index:9999' > \
                    "+ summary + ". " + string + "</div>";
                    document.querySelectorAll('.icon_acrevus'+String(id))[0].outerHTML += "<div class='yes_btn"+String(id) + "' style='background-image: url(\"chrome-extension:" + String(chrome.runtime.id) + "/img/yes_button.png\"); width:120px; \
                        height:28px; position:relative;left:610px;top:-204px;z-index:9999' ></div>"
                    document.querySelectorAll('.icon_acrevus'+String(id))[0].outerHTML += "<div class='no_btn"+String(id) + "' style='background-image: url(\"chrome-extension:" + String(chrome.runtime.id) + "/img/no_button.png\"); width:120px; \
                        height:28px; position:relative;left:740px;top:-176px;z-index:9999' ></div>"
                        document.querySelectorAll('.icon_acrevus'+String(id))[0].outerHTML += "<div class='star"+String(id) + "' style='background-image: url(\"chrome-extension:" + String(chrome.runtime.id) + "/img/full_star.png\"); width:35px; \
                        height:32px; position:relative;left:640px;top:-305px;z-index:9999;background-size: 35px;' ></div>"
                    }
                    const tmp1 = document.getElementsByClassName("icon_acrevus" + String(id))[0];
                    tmp1.id = String(id);
                    tmp1.addEventListener("click", close_window, false);
                }
            ) 
            // log_user_entry(site, -1);   
        }
    });
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
