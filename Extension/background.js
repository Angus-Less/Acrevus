// on tab load
chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete' || changeInfo.url) {
        chrome.tabs.executeScript(tabId, {
            code: `String(document.URL)`
            }, function(url) {
                if (String(url).includes("google.com")) {
                    load_icons(false); 
                } else if (String(url).includes("twitter")) {
                    setTimeout(function() {
                        setInterval(function() {
                            load_icons(true); // twitter
                        }, 5000);
                      }, 1000);
                }
        });
    }
})

/**
 * Handles window functionality (open window, close, send ratings etc.)
 * 
 * Param:
 *      - evt: event listener when icon opened. 
 */
function display_window(evt) {

    // <p> tag message when user sends a rating. 
    rating_message = "<p style='z-index:9999;position:absolute;left:45px;top:390px;width:250px;color:white;font-size:15px;'> Thank you for your rating. </p>";

    /**
     * Closes window on click (or if automatically clicked).
     * 
     * Param:
     *      - evt_close: event listener when window clicked to close. 
     */
    function close_window(evt_close) {
        domain_id = evt_close.currentTarget.id;
        domain = evt_close.currentTarget.domain;
        rating = evt_close.currentTarget.rating;
        twitter = evt_close.currentTarget.twitter;
        // check if window exists
        if (document.querySelectorAll('.popup_acrevus'+String(domain_id)).length > 0) {
            // remove stars and popup
            document.querySelectorAll('.popup_acrevus'+String(domain_id))[0].outerHTML = "";
            try {
                document.querySelectorAll('.yes_btn'+String(domain_id))[0].outerHTML = "";
                document.querySelectorAll('.no_btn'+String(domain_id))[0].outerHTML = "";
            } catch (err) {
                // already deleted yes/no buttons (unclicked)
            }
            document.querySelectorAll('.star1'+String(domain_id))[0].outerHTML = "";
            document.querySelectorAll('.star2'+String(domain_id))[0].outerHTML = "";
            document.querySelectorAll('.star3'+String(domain_id))[0].outerHTML = "";
            document.querySelectorAll('.star4'+String(domain_id))[0].outerHTML = "";
            document.querySelectorAll('.star5'+String(domain_id))[0].outerHTML = "";

            // add click event back to icon as it has been disabled
            const open_window_evt = document.getElementsByClassName("icon_acrevus" + String(domain_id))[0];
            open_window_evt.id = domain_id;
            open_window_evt.domain = domain;
            open_window_evt.rating = rating;
            open_window_evt.twitter = twitter;
            open_window_evt.addEventListener("click", display_window, false);
        }
    }

    /**
     * Upvote or Downvote domain as being reliable to server, and remove buttons so users cant spam votes.
     * 
     * Param:
     *      - evt: event listener when yes button clicked. 
     *      - evt.rating: -1 if unreliable, 1 if reliable.
     *      - evt.domain: website domain the window is associated to.
     *      - evt.id: id of the window for this domain.
     */
    function send_rating(evt) {
        domain = String(evt.currentTarget.domain);
        domain_id = evt.currentTarget.id;
        score = evt.currentTarget.rating;
        log_user_entry(domain, score); // 1 for reliable, -1 for unreliable
        document.querySelectorAll('.yes_btn'+String(domain_id))[0].outerHTML = "";
        document.querySelectorAll('.no_btn'+String(domain_id))[0].outerHTML = "";
        document.querySelectorAll('.popup_acrevus'+String(domain_id))[0].innerHTML += rating_message;
    }

    // icon id number
    var id = evt.currentTarget.id;
    // wikipedia rating category for this domain
    var rating = evt.currentTarget.rating;
    // if icon has been clicked, popup will exist already
    var clicked = document.getElementsByClassName("popup_acrevus"+String(id)).length != 0;
    // site domain for this window
    var site = String(evt.currentTarget.domain);
    var site_name = site;
    var twitter = evt.currentTarget.twitter;

    get_name(site).then(name => {
        if (name != null) {
            site_name = name;
        }
    });
    
    // if window not open, open it
    if (!clicked) {
        // close other windows
        other_popups = document.querySelectorAll('[class^="popup_acrevus"]')
        yes_btns = document.querySelectorAll('[class^="yes_btn"]')
        no_btns = document.querySelectorAll('[class^="no_btn"]')
        star_btns = document.querySelectorAll('[class^="star"]')
        for (k = 0; k < other_popups.length; k++) {
            // remove other window by force clicking on its icon
            other_id = other_popups[k].className.split("acrevus")[1];
            const other_icon = document.getElementsByClassName("icon_acrevus" + String(other_id))[0];
            other_icon.click();                    
        }

        // get summary for this domain from gpt3
        check_website_gpt(site).then(summary => {

            // get user ratings (thumbs up: yes, thumbs down: no)
            get_site_user_rating(site).then(
                function(res) {
                    // yes, no ratings
                    thumb_up = res[0];
                    thumb_down = res[1];
                    // Text to display user rating info.
                    var ratingDescription = null;
                    if (thumb_up === -666) {
                        ratingDescription = "User rating is unavailable for this website."
                        var stars = 0
                    } else {
                        // scale rating to [0,5] range for displaying stars
                        var stars = (thumb_up/(thumb_up + thumb_down) * 5).toFixed(2)
                        ratingDescription = "Out of " + (thumb_up + thumb_down) + " ratings, " + site + " was rated " + stars + " out of 5."
                    }
                    // get star icons
                    var star_amounts = ["empty_star", "empty_star", "empty_star", "empty_star", "empty_star"]
                    for (var i = 0; i < star_amounts.length; i++) {
                        if (stars >= i + 1) {
                            star_amounts[i] = "full_star";
                        } else if (stars >= i + 0.5) {
                            star_amounts[i] = "half_star";
                        }
                    } 
                    // get trustworthy text based on wikipedia reliability rating.
                    var ratingDict = {
                        null : " is not present in the Wikipedia website reliability data.",
                        "-1" : " is considered an untrusted source of information by Wikipedia.",
                        "0" : " is considered a questionable source of information by Wikipedia.",
                        "1" : " is considered a trustworthy source of information by Wikipedia."
                    }
                    var trustworthy_rating = ratingDict[rating];
                    
                    // html for window popup template
                    tmp = [600, -30]
                    if (twitter) {
                        tmp = [120, 0]
                    }
                    popup_html = "<div class='popup_acrevus" + String(id) + "' style=\"background-image: \
                        url('chrome-extension:" + String(chrome.runtime.id) + "/img/window.png'); \
                        width:270px; height:446px; position:relative;left:" + tmp[0] + "px;top:"+tmp[1]+"px;z-index:9998;background-size: contain;\">";

                    // add credibility summary to window
                    if (summary == null) {
                        document.querySelectorAll('.icon_acrevus'+String(id))[0].innerHTML += popup_html + 
                            "<p style='color:white;font-size:10px;position:absolute;left:13px;top:196px;\
                            width:90%;word-wrap:break-word;" + (twitter ? "white-space: normal" : "") + ";z-index:9999;'>" + ratingDescription + "</p>" + 
                            "<p align=\"justify\" style='color:white;font-size:10px;position:absolute;left:13px;top:250px;\
                            width:90%;word-wrap:break-word;" + (twitter ? "white-space: normal" : "") + ";z-index:9999;'>(Summary Unavailable)</p>" 
                            + "<p style='color:white;font-size:10px;position:absolute;left:13px;top:90px;\
                            width:90%;word-wrap:break-word;" + (twitter ? "white-space: normal" : "") + ";z-index:9999;'>" + String(site_name) + String(trustworthy_rating) +"</p>"
                    } else {
                        var summaryFormatted = summary.replace(new RegExp('{|}|[|]', 'g'), '');
                        document.querySelectorAll('.icon_acrevus'+String(id))[0].innerHTML += popup_html + 
                            "<p align=\"justify\" style='color:white;font-size:10px;position:absolute;left:13px;top:250px;\
                            width:90%;word-wrap:break-word;" + (twitter ? "white-space: normal" : "") + ";z-index:9999;'>" + summaryFormatted + "</p>" + 
                            "<p style='color:white;font-size:10px;position:absolute;left:13px;top:196px;\
                            width:90%;word-wrap:break-word;" + (twitter ? "white-space: normal" : "") + ";z-index:9999;'>" + ratingDescription + "</p>" 
                            + "<p style='color:white;font-size:10px;position:absolute;left:13px;top:90px;\
                            width:90%;word-wrap:break-word;" + (twitter ? "white-space: normal" : "") + ";z-index:9999;'>" + String(site_name) + String(trustworthy_rating) + "</p></div>";
                    }

                    // add yes and no buttons and stars
                    // surround by <a> tag with blank javascript to override click event to go to the domain website
                    document.querySelectorAll('.icon_acrevus'+String(id))[0].outerHTML += "<a href='javascript:;' \
                        style='z-index:9999' ><div class='yes_btn"+String(id) + "'style='background-image: \
                        url(\"chrome-extension:" + String(chrome.runtime.id) + "/img/yes_button.png\"); width:117px; \
                        height:28px; position:relative;left:" + ((twitter) ? 130 : 610) + "px;top:"+((twitter) ? -230 : -260)+"px;z-index:9999;background-size: contain;'></div></a>";
                    document.querySelectorAll('.icon_acrevus'+String(id))[0].outerHTML += "<a href='javascript:;' \
                        style='z-index:100000' ><div class='no_btn"+String(id) + "'style='background-image: \
                        url(\"chrome-extension:" + String(chrome.runtime.id) + "/img/no_button.png\"); width:120px; \
                        height:28px; position:relative;left:" + ((twitter) ? 260 : 740) + "px;top:" + ((twitter) ? -202 : -232) + "px;z-index:9999;background-size: contain;'></div></a>";
                    document.querySelectorAll('.icon_acrevus'+String(id))[0].outerHTML += "<a href='javascript:;' \
                        style='z-index:9999' ><div class='star1"+String(id) + "' style='background-image: \
                        url(\"chrome-extension:" + String(chrome.runtime.id) + "/img/" + String(star_amounts[0]) + ".png\"); width:35px; \
                        height:32px; position:relative;left:" + ((twitter) ? 155 : 635) + "px;top:"+((twitter) ? -410 : -438)+"px;z-index:9999;background-size: 35px;' ></div></a>";
                    document.querySelectorAll('.icon_acrevus'+String(id))[0].outerHTML += "<a href='javascript:;' \
                        style='z-index:9999' ><div class='star2"+String(id) + "' style='background-image: \
                        url(\"chrome-extension:" + String(chrome.runtime.id) + "/img/" + String(star_amounts[1]) + ".png\"); width:35px; \
                        height:32px; position:relative;left:" + ((twitter) ? 195 : 675) + "px;top:"+((twitter) ? -378 : -406)+"px;z-index:9999;background-size: 35px;' ></div></a>";
                    document.querySelectorAll('.icon_acrevus'+String(id))[0].outerHTML += "<a href='javascript:;' \
                        style='z-index:9999' ><div class='star3"+String(id) + "' style='background-image: \
                        url(\"chrome-extension:" + String(chrome.runtime.id) + "/img/" + String(star_amounts[2]) + ".png\"); width:35px; \
                        height:32px; position:relative;left:" + ((twitter) ? 235 : 715) + "px;top:"+((twitter) ? -346 : -374)+"px;z-index:9999;background-size: 35px;' ></div></a>";
                    document.querySelectorAll('.icon_acrevus'+String(id))[0].outerHTML += "<a href='javascript:;' \
                        style='z-index:9999' ><div class='star4"+String(id) + "' style='background-image: \
                        url(\"chrome-extension:" + String(chrome.runtime.id) + "/img/" + String(star_amounts[3]) + ".png\"); width:35px; \
                        height:32px; position:relative;left:" + ((twitter) ? 275 : 755) + "px;top:"+((twitter) ? -314 : -342)+"px;z-index:9999;background-size: 35px;' ></div></a>";
                    document.querySelectorAll('.icon_acrevus'+String(id))[0].outerHTML += "<a href='javascript:;' \
                        style='z-index:9999' ><div class='star5"+String(id) + "' style='background-image: \
                        url(\"chrome-extension:" + String(chrome.runtime.id) + "/img/" + String(star_amounts[4]) + ".png\"); width:35px; \
                        height:32px; position:relative;left:" + ((twitter) ? 315 : 795) + "px;top:"+((twitter) ? -282 : -310)+"px;z-index:9999;background-size: 35px;'></div></a>";

                    // add click events to yes and no buttons
                    const yes_btn_evt = document.getElementsByClassName("yes_btn" + String(id))[0];
                    yes_btn_evt.domain = String(site);
                    yes_btn_evt.id = id;
                    yes_btn_evt.rating = 1; // reliable
                    yes_btn_evt.addEventListener("click", send_rating, false);
                    
                    const no_btn_evt = document.getElementsByClassName("no_btn" + String(id))[0];
                    no_btn_evt.domain = String(site);
                    no_btn_evt.id = id;
                    no_btn_evt.rating = -1; // unreliable
                    no_btn_evt.addEventListener("click", send_rating, false);
                    
                    // add click event back to icon as it has been disabled
                    const open_window_evt = document.getElementsByClassName("icon_acrevus" + String(id))[0];
                    open_window_evt.id = String(id);
                    open_window_evt.rating = rating;
                    open_window_evt.domain = String(site);
                    open_window_evt.twitter = twitter;
                    open_window_evt.addEventListener("click", close_window, false);
                }
            )   
        });
    }
}

/**
 * Creates icons next to cite tags on google (domains) on page load.
 */
function load_icons(twitter) {
    chrome.tabs.query({active: true}, function(tabs) {
        var tab = tabs[0];
        // execute firebase scripts so firebase can be queried
        chrome.tabs.executeScript(tab.id, {
            file: "firebase-app.js"
        });
        chrome.tabs.executeScript(tab.id, {
            file: "firebase-firestore.js"
        });
        chrome.tabs.executeScript(tab.id, {
            file: "firebase.js"
        });
        // get number of google cite tags
        chrome.tabs.executeScript(tab.id, {
        code: `if (!${twitter}) {
                document.querySelectorAll("cite").length;
                } else {
                    ~~(document.querySelectorAll(".css-901oao.css-bfa6kz.r-14j79pv.r-37j5jr.r-a023e6.r-16dba41.r-rjixqe.r-bcqeeo.r-qvutc0:not(.r-18u37iz)").length);
                }`
        }, function(numberOfSites) {
            var domains = [];
            var id = chrome.runtime.id;
            // get list of all domains
            chrome.tabs.executeScript(tab.id, {
                code: ` 
                        var page_domains = [];
                        console.log("${numberOfSites}");
                        for (i = 0; i < ${numberOfSites}; i++) {
                            if (!${twitter}) {
                                domain = String(document.querySelectorAll("cite")[i].textContent).split(" ")[0];
                            } else {
                                tmp = document.querySelectorAll(".css-901oao.css-bfa6kz.r-14j79pv.r-37j5jr.r-a023e6.r-16dba41.r-rjixqe.r-bcqeeo.r-qvutc0:not(.r-18u37iz)")[i];
                                domain = String(tmp.textContent).split(" ")[0];
                            }
                            console.log(domain);
                            // remove domain text after .com and before and including https://www. 
                            if (domain.includes("com")) {
                                domain = domain.split("com")[0] + "com";
                            }
                            domain = domain.split(".");
                            domain = domain.at(-2) + "." + domain.at(-1);
                            if (domain.includes("//")) {
                                domain = domain.split("//").at(-1);
                            }
                            if (domain.includes("/")) {
                                domain = domain.split("/")[0];
                            }
                            page_domains[i] = domain;
                        }
                        page_domains;
                    `
            }, function(page_domains) {
                domains = page_domains[0]; // 0th index gets all domains
                // add quotes so ${domains} will read each domain as a string
                for (i = 0; i < domains.length; i++) {
                    domains[i] = '"' + domains[i] + '"';
                }
                // add icons to each site
                for (i = 0; i < numberOfSites; i++) {
                    chrome.tabs.executeScript(tab.id, {
                        code: `
                                domain = [${domains}][${i}];
                                // get wikipedia rating for this domain to base the icon img / category
                                check_website(String(domain)).then(rating => {
                                    // get image path for icon based on rating
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
                                    // add icon if it has not been added yet
                                    loaded = document.querySelectorAll(".icon_acrevus${i}").length != 0; 
                                    if (!loaded) { 
                                        // add icon
                                        if (!${twitter}) {
                                            document.querySelectorAll("cite")[${i}].innerHTML += "<a href='javascript:;' \
                                            class='icon_acrevus"+String(${i})+"' style='z-index:100000'><img src = \
                                            chrome-extension:/${id}/img/" + String(icon_path) + " \
                                            style='width:20px;height:20px;vertical-align: middle;margin-left:8px;'></button>";
                                        } else {
                                            document.querySelectorAll(".css-901oao.css-bfa6kz.r-14j79pv.r-37j5jr.r-a023e6.r-16dba41.r-rjixqe.r-bcqeeo.r-qvutc0:not(.r-18u37iz)")[${i}].innerHTML += "<a href='javascript:;' \
                                            class='icon_acrevus"+String(${i})+"' style='z-index:100000'><img src = \
                                            chrome-extension:/${id}/img/" + String(icon_path) + " \
                                            style='width:20px;height:20px;vertical-align: middle;margin-left:8px;'></button>";
                                        }

                                        // add click event listener to open window on icon click
                                        const open_window_evt = document.getElementsByClassName("icon_acrevus" + String(${i}))[0];
                                        open_window_evt.id = ${i};
                                        open_window_evt.domain = [${domains}][${i}];
                                        open_window_evt.rating = rating;
                                        open_window_evt.twitter = ${twitter};
                                        open_window_evt.addEventListener("click", ${display_window}, false);
                                    } 
                                });
                            `
                    }, function() {});
                };
            });  
        });   
    });
}
