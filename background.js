// on tab load
chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete' || changeInfo.url) {
        get_domain_tags(); 
    }
  }
)


function display_window(evt) {

    function close_window(evt2) {
        idd = evt2.currentTarget.id;
        domain = evt2.currentTarget.domain;
        rating = evt2.currentTarget.rating;
        console.log("IDDD:" + String(idd));
        if (document.querySelectorAll('.popup_acrevus'+String(idd)).length > 0) {
            document.querySelectorAll('.popup_acrevus'+String(idd))[0].outerHTML = "";
            document.querySelectorAll('.yes_btn'+String(idd))[0].outerHTML = "";
            document.querySelectorAll('.no_btn'+String(idd))[0].outerHTML = "";
            document.querySelectorAll('.star1'+String(idd))[0].outerHTML = "";
            document.querySelectorAll('.star2'+String(idd))[0].outerHTML = "";
            document.querySelectorAll('.star3'+String(idd))[0].outerHTML = "";
            document.querySelectorAll('.star4'+String(idd))[0].outerHTML = "";
            document.querySelectorAll('.star5'+String(idd))[0].outerHTML = "";
            const tmp1 = document.getElementsByClassName("icon_acrevus" + String(idd))[0];
            tmp1.id = idd;
            tmp1.domain = domain;
            tmp1.rating = rating;
            tmp1.addEventListener("click", display_window, false);
        }
    }

    function send_yes(evt) {
        domain = String(evt.currentTarget.domain);
        console.log(domain);
        console.log("Sent yes.");
        log_user_entry(domain, 1); 
    }
    
    function send_no(evt) {
        domain = String(evt.currentTarget.domain);
        console.log(domain);
        console.log("Sent no.");
        log_user_entry(domain, -1); 
    }

    var id = evt.currentTarget.id;
    console.log(id);
    var rating = evt.currentTarget.rating;
    var clicked = document.getElementsByClassName("popup_acrevus"+String(id)).length != 0;
    console.log("clicked:" + String(clicked));
    site = String(evt.currentTarget.domain);
    console.log(site);

    check_website_gpt(site).then(summary => {
        if (!clicked) {
            other_popups = document.querySelectorAll('[class^="popup_acrevus"]')
            yes_btns = document.querySelectorAll('[class^="yes_btn"]')
            no_btns = document.querySelectorAll('[class^="no_btn"]')
            star_btns = document.querySelectorAll('[class^="star"]')
            for (k = 0; k < other_popups.length; k++) {
                var other_id = other_popups[k].className.split("acrevus")[1];
                other_popups[k].innerHTML = "";
                const tmp1 = document.getElementsByClassName("icon_acrevus" + String(other_id))[0];
                tmp1.click();                    
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
                    var ratingDescription = null
                    if (thumb_up === -666) {
                        ratingDescription = "User rating is unavailable for this website."
                        var stars = 0
                    } else {
                        var stars = (thumb_up/(thumb_up + thumb_down) * 5).toFixed(2)
                        ratingDescription = "Out of " + (thumb_up + thumb_down) + " ratings, " + site + " was rated " + stars + " out of 5."
                    }
                    var star_amounts = ["empty_star", "empty_star", "empty_star", "empty_star", "empty_star"]
                    for (var i = 0; i < star_amounts.length; i++) {
                        if (stars >= i + 1) {
                            star_amounts[i] = "full_star";
                        } else if (stars >= i + 0.5) {
                            star_amounts[i] = "half_star";
                        }
                    } 
                    var ratingDict = {
                        null : " is not present in the Wikipedia website reliability data.",
                        "-1" : " is considered an untrusted source of information by Wikipedia.",
                        "0" : " is considered a questionable source of information by Wikipedia.",
                        "1" : " is considered a trustworthy source of information by Wikipedia."
                    }
                    var trustworthy_rating = ratingDict[rating];
                    
                    var summaryFormatted = summary.replace(new RegExp('{|}|[|]', 'g'), '');

                    document.querySelectorAll('.icon_acrevus' + String(id))[0].innerHTML += "<div class='popup_acrevus" + String(id) + "'style='background-color:black; width:270px; height:75px; position:relative; left:600px;top:-30px; z-index:9999'> <p>Acrevus</p> </div>"
                    
                    // if (summaryFormatted == null) {
                    //     document.querySelectorAll('.icon_acrevus'+String(id))[0].innerHTML += "<div class='popup_acrevus"+String(id) + "'style='background-image: url(\"chrome-extension:" + String(chrome.runtime.id) + "/img/window.png\");  \
                    //     height:446px; position:relative;left:600px;top:-30px;z-index:9999'>" + "<p style='color:white;font-size:10px;position:absolute;left:13px;top:196px;width:90%;word-wrap:break-word;'>" + ratingDescription + "</p>" + "<p style='color:white;font-size:10px;position:absolute;left:13px;top:250px;width:90%;word-wrap:break-word;'>(Summary Unavailable)</p>" 
                    //     + "<p style='color:white;font-size:10px;position:absolute;left:13px;top:90px;width:90%;word-wrap:break-word;'>" + String(site) + String(trustworthy_rating) +"</p></div>"
                    //     document.querySelectorAll('.icon_acrevus'+String(id))[0].outerHTML += "<a href='javascript:;' style='z-index:100000' ><div class='yes_btn"+String(id) + "'style='background-image: url(\"chrome-extension:" + String(chrome.runtime.id) + "/img/yes_button.png\"); width:120px; \
                    //     height:28px; position:relative;left:610px;top:-260px;z-index:9999'></div></a>"
                    //     document.querySelectorAll('.icon_acrevus'+String(id))[0].outerHTML += "<a href='javascript:;' style='z-index:100000' ><div class='no_btn"+String(id) + "'style='background-image: url(\"chrome-extension:" + String(chrome.runtime.id) + "/img/no_button.png\"); width:120px; \
                    //     height:28px; position:relative;left:740px;top:-232px;z-index:9999'></div></a>"
                    //     document.querySelectorAll('.icon_acrevus'+String(id))[0].outerHTML += "<a href='javascript:;' style='z-index:100000' ><div class='star1"+String(id) + "' style='background-image: url(\"chrome-extension:" + String(chrome.runtime.id) + "/img/" + String(star_amounts[0]) + ".png\"); width:35px; \
                    //     height:32px; position:relative;left:635px;top:-438px;z-index:9999;background-size: 35px;' ></div></a>"
                    //     document.querySelectorAll('.icon_acrevus'+String(id))[0].outerHTML += "<a href='javascript:;' style='z-index:100000' ><div class='star2"+String(id) + "' style='background-image: url(\"chrome-extension:" + String(chrome.runtime.id) + "/img/" + String(star_amounts[1]) + ".png\"); width:35px; \
                    //     height:32px; position:relative;left:675px;top:-406px;z-index:9999;background-size: 35px;' ></div></a>"
                    //     document.querySelectorAll('.icon_acrevus'+String(id))[0].outerHTML += "<a href='javascript:;' style='z-index:100000' ><div class='star3"+String(id) + "' style='background-image: url(\"chrome-extension:" + String(chrome.runtime.id) + "/img/" + String(star_amounts[2]) + ".png\"); width:35px; \
                    //     height:32px; position:relative;left:715px;top:-374px;z-index:9999;background-size: 35px;' ></div></a>"
                    //     document.querySelectorAll('.icon_acrevus'+String(id))[0].outerHTML += "<a href='javascript:;' style='z-index:100000' ><div class='star4"+String(id) + "' style='background-image: url(\"chrome-extension:" + String(chrome.runtime.id) + "/img/" + String(star_amounts[3]) + ".png\"); width:35px; \
                    //     height:32px; position:relative;left:755px;top:-342px;z-index:9999;background-size: 35px;' ></div></a>"
                    //     document.querySelectorAll('.icon_acrevus'+String(id))[0].outerHTML += "<a href='javascript:;' style='z-index:100000' ><div class='star5"+String(id) + "' style='background-image: url(\"chrome-extension:" + String(chrome.runtime.id) + "/img/" + String(star_amounts[4]) + ".png\"); width:35px; \
                    //     height:32px; position:relative;left:795px;top:-310px;z-index:9999;background-size: 35px;' ></div></a>"
                    // } else {
                    //     document.querySelectorAll('.icon_acrevus'+String(id))[0].innerHTML += "<div class='popup_acrevus"+String(id) + "'style='background-image: url(\"chrome-extension:" + String(chrome.runtime.id) + "/img/window.png\"); width:270px; \
                    // height:446px; position:relative;left:600px;top:-30px;z-index:9999'> \
                    // " + "<p style='color:white;font-size:10px;position:absolute;left:13px;top:250px;width:90%;word-wrap:break-word;'>" + summaryFormatted + "</p>" + ". " + "<p style='color:white;font-size:10px;position:absolute;left:13px;top:196px;width:90%;word-wrap:break-word;'>" + ratingDescription + "</p>" + 
                    // "<p style='color:white;font-size:10px;position:absolute;left:13px;top:90px;width:90%;word-wrap:break-word;'>" + String(site) + String(trustworthy_rating) + "</p></div>";
                    // document.querySelectorAll('.icon_acrevus'+String(id))[0].outerHTML += "<a href='javascript:;' style='z-index:100000' ><div class='yes_btn"+String(id) + "'style='background-image: url(\"chrome-extension:" + String(chrome.runtime.id) + "/img/yes_button.png\"); width:120px; \
                    //     height:28px; position:relative;left:610px;top:-260px;z-index:9999'></div></a>"
                    // document.querySelectorAll('.icon_acrevus'+String(id))[0].outerHTML += "<a href='javascript:;' style='z-index:100000' ><div class='no_btn"+String(id) + "'style='background-image: url(\"chrome-extension:" + String(chrome.runtime.id) + "/img/no_button.png\"); width:120px; \
                    //     height:28px; position:relative;left:740px;top:-232px;z-index:9999'></div></a>"
                    //     document.querySelectorAll('.icon_acrevus'+String(id))[0].outerHTML += "<a href='javascript:;' style='z-index:100000' ><div class='star1"+String(id) + "' style='background-image: url(\"chrome-extension:" + String(chrome.runtime.id) + "/img/" + String(star_amounts[0]) + ".png\"); width:35px; \
                    //     height:32px; position:relative;left:635px;top:-438px;z-index:9999;background-size: 35px;' ></div></a>"
                    //     document.querySelectorAll('.icon_acrevus'+String(id))[0].outerHTML += "<a href='javascript:;' style='z-index:100000' ><div class='star2"+String(id) + "' style='background-image: url(\"chrome-extension:" + String(chrome.runtime.id) + "/img/" + String(star_amounts[1]) + ".png\"); width:35px; \
                    //     height:32px; position:relative;left:675px;top:-406px;z-index:9999;background-size: 35px;' ></div></a>"
                    //     document.querySelectorAll('.icon_acrevus'+String(id))[0].outerHTML += "<a href='javascript:;' style='z-index:100000' ><div class='star3"+String(id) + "' style='background-image: url(\"chrome-extension:" + String(chrome.runtime.id) + "/img/" + String(star_amounts[2]) + ".png\"); width:35px; \
                    //     height:32px; position:relative;left:715px;top:-374px;z-index:9999;background-size: 35px;' ></div></a>"
                    //     document.querySelectorAll('.icon_acrevus'+String(id))[0].outerHTML += "<a href='javascript:;' style='z-index:100000' ><div class='star4"+String(id) + "' style='background-image: url(\"chrome-extension:" + String(chrome.runtime.id) + "/img/" + String(star_amounts[3]) + ".png\"); width:35px; \
                    //     height:32px; position:relative;left:755px;top:-342px;z-index:9999;background-size: 35px;' ></div></a>"
                    //     document.querySelectorAll('.icon_acrevus'+String(id))[0].outerHTML += "<a href='javascript:;' style='z-index:100000' ><div class='star5"+String(id) + "' style='background-image: url(\"chrome-extension:" + String(chrome.runtime.id) + "/img/" + String(star_amounts[4]) + ".png\"); width:35px; \
                    //     height:32px; position:relative;left:795px;top:-310px;z-index:9999;background-size: 35px;' ></div></a>"
                    // }
                    const tmp2 = document.getElementsByClassName("yes_btn" + String(id))[0];
                    tmp2.domain = String(site);
                    tmp2.addEventListener("click", send_yes, false);
                    
                    const tmp3 = document.getElementsByClassName("no_btn" + String(id))[0];
                    tmp3.domain = String(site);
                    tmp3.addEventListener("click", send_no, false);
                   
                    const tmp1 = document.getElementsByClassName("icon_acrevus" + String(id))[0];
                    tmp1.id = String(id);
                    tmp1.rating = rating;
                    tmp1.domain = String(site);
                    tmp1.addEventListener("click", close_window, false);
                }
            )   
        }
    });
}

/**
 * Returns an array of all the domains in the HTML page the user is looking at.
 * 
 * Return:
 *      Array containing all websites listed on a given google search.
 */
function get_domain_tags() {
    var tab_title = '';
    var currentPage = 0; // This should be incremented in states of 2 [0, 2, 4, etc...]
    var list_of_sites = [];

    // Get the number of searches available.
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
                                            document.querySelectorAll("cite")[${i}].innerHTML += "<a href='javascript:;' class='icon_acrevus"+String(${i})+"' style='z-index:100000'><img src = chrome-extension:/${id}/img/" + String(icon_path) + " style='width:20px;height:20px;vertical-align: middle;margin-left:8px;'></button>"
                                            const tmp1 = document.getElementsByClassName("icon_acrevus" + String(${i}))[0];
                                            tmp1.id = ${i};
                                            tmp1.domain = [${domains}][${i}];
                                            tmp1.rating = rating;
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
