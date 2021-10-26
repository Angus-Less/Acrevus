// The app's Firebase configuration(change it to fit your database).
var firebaseConfig = {
    apiKey: "AIzaSyDrD-udDqxDehOayG9U95fAeAYlwFwIYME",
    authDomain: "acrevus-4bb74.firebaseapp.com",
    projectId: "acrevus-4bb74",
    storageBucket: "acrevus-4bb74.appspot.com",
    messagingSenderId: "435255014159",
    appId: "1:435255014159:web:6aa1f1b4ea0af1360a447a",
    measurementId: "G-33TKV57R3K"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();
var siteCollection = "GPT3-Sites";


 /**
 * Logs the website to the firestore database.
 * 
 * Param:
 *      - site:
 *      - rating:
 *      - description:
 * Return:
 *      - 0 if successful, -1 if an error occurred (as well as error dump to console).
 */
async function log_website(site) {
    // Shortened macro for the entire website.
    var site = '';
    const websiteReference = db.collection('Blacklisted_sites').description(`${site}`).get();
    console.log(websiteReference);
    return 0;

}


 /**
 * Checks against the database if either this specific article is flagged,
 * or if the website is flagged. 
 *
 * THIS IS ASYNC AND I DON'T KNOW WHAT THAT MEANS
 * 
 * Param:
 *      - site: string comprising the article itself. 
 * Return:
 *      - -1    if website is flagged.
 *      - 0     if site is disputed.
 *      - 1     if website is endorsed.
 *      - null  if website is unknown
 */
function check_website(site) {
    var docRef = db.collection(siteCollection).doc(site);

    return docRef.get().then(
        (doc) => {
            if (doc.exists) {
                console.log("Document data:", doc.data());
                
                data = doc.data();
                console.log(data.rating);
                return data.rating;
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
                return null;
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        })
}

 /**
 * Checks against the database to get GPT summary.
 * 
 * Param:
 *      - site: string comprising the article itself. 
 * Return:
 *      GPT-3 Summary 
 */
function check_website_gpt(site) {
    var docRef = db.collection(siteCollection).doc(site);

    return docRef.get().then(
        (doc) => {
            console.log(doc)
            if (doc.exists) {
                console.log("Document data:", doc.data());
                
                data = doc.data();
                return data.desc;
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
                return null;
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        })
}

/**
 * If the site is found in the Wikipedia sources, return its proper name
 * 
 * Param:
 *      - site: string comprising the article itself. 
* Return:
*      - string: name of site
*/
function get_name(site) {
     var docRef = db.collection(siteCollection).doc(site);

    return docRef.get().then(
        (doc) => {
            console.log(doc)
            if (doc.exists) {
                console.log("Document data:", doc.data());
                
                data = doc.data();
                return data.name;
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
                return null;
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        })
}

 /**
 * Logs the website to the firestore database.
 * 
 * Param:
 *      - URL: string
 *      - site: string w/ name
 *      - rating: int
 *      - description: words
 *      
 * Return:
 *      - 0 if successful, -1 if an error occurred (as well as error dump to console).
 */
function log_website(URL, site, rating, description) {
    // Add a new document in collection "cities"
    db.collection(siteCollection).doc(URL).set({
        name: site,
        rating: rating,
        desc: description
    })
    .then(() => {
        console.log("Document successfully written!");
        return 0;
    })
    .catch((error) => {
        console.error("Error writing document: ", error);
        return -1;
    });

    return 0;
}

 /**
 * Logs the user's rating (out of a CURRENTLY ARBITRARY NUMBER).
 * 
 * Param:
 *      - site: the article being rated.
 *      - rating: the user rating.
 * Return:
 *      - -1    if error occurred.
 *      - 0     if successful.
 */
function log_user_entry(site, rating) {
    // Assume rating = 1 or -1
    if (rating != -1 && rating != 1) {
        return -1
    }

    var docRef = db.collection("UserRatings").doc(site);
    docRef.get()
        .then((docSnapshot) => {
            if (docSnapshot.exists) {
                if (rating == 1) {
                    docRef.update({
                        "thumbs_up": firebase.firestore.FieldValue.increment(1)
                    });
                } else {
                    docRef.update({
                        "thumbs_down": firebase.firestore.FieldValue.increment(1)
                    });
                }
                
            } else {
                if (rating == 1) {
                    docRef.set({
                        "thumbs_up": 1,
                        "thumbs_down": 0,
                    })
                } else {
                    docRef.set({
                        "thumbs_up": 0,
                        "thumbs_down": 1,
                    
                    })
                } 
            }
    });
    return 0
}

 /**
 * Retrieves user ratings for a specific domain.
 * 
 * Param:
 *      - site: the article being rated.
 * Return:
 *      - a promise containing the result 
 *             [thumb_up, thumb_down] or [-666, -666] if not exist   
 */
function get_site_user_rating(site){
    return new Promise(function (resolve) {
        var docRef = db.collection("UserRatings").doc(site)
        var rating = null
        docRef.get().then(
            (doc) => {
                if (doc.exists) {
                    rating = [doc.data().thumbs_up, doc.data().thumbs_down]
                    resolve(rating) 
                } else {
                    rating = [-666, -666]
                    resolve(rating) 
                }
            }
        ).catch(err => console.log('error', err));
    })
}
    
