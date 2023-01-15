// export const extraction = () => {
//   window.onscroll = function () {
//     //@ts-ignore
//     document.getElementById("basicprofile").value = JSON.stringify(extract())
//   }

//   //deploying listeners for `manual extraction` buttons feature
//   document
//     .getElementById("certification_extract_button")
//     .addEventListener("click", extractCert)
//   document
//     .getElementById("skills_extract_button")
//     .addEventListener("click", extractSkills)
//   document
//     .getElementById("experience_extract_button")
//     .addEventListener("click", extractExperience)
//   document
//     .getElementById("education_extract_button")
//     .addEventListener("click", extractEducation)
//   4

//   //save data button
//   document
//     .getElementById("save_profile_data_button")
//     .addEventListener("click", saveProfileData)
// }

// function saveProfileData()  {
//   let textBoxIds = [
//     "basicprofile",
//     "educationtext",
//     "experiencetext",
//     "skillstext",
//     "certificationstext"
//   ]
//   let profileData = {}
//   for (let i = 0; i < textBoxIds.length; i++) {
//     let tempid = textBoxIds[i]
//     if (tempid.includes("text")) tempid = tempid.replace("text", "")

//     //@ts-ignore
//     if (document.getElementById(textBoxIds[i]).value)
//       profileData[tempid] = JSON.parse(
//         //@ts-ignore
//         document.getElementById(textBoxIds[i]).value
//       )
//     else profileData[tempid] = "No data"
//   }

//   // download file code
//   let filename = prompt("Enter file Name:")
//   let data = new Blob([JSON.stringify(profileData)], {
//     type: "application/json"
//   })
//   let a = document.createElement("a"),
//     url = URL.createObjectURL(data)
//   a.href = url
//   a.download = filename + ".txt"
//   document.body.appendChild(a)
//   a.click()
//   setTimeout(function () {
//     document.body.removeChild(a)
//     window.URL.revokeObjectURL(url)
//   }, 0)
// } // save profile data ends here

// function printName() {
//   let uname =
//     document?.querySelector("div.pv-text-details__left-panel > div > h1") ||
//     document?.getElementsByClassName(
//       "artdeco-entity-lockup__title ember-view"
//     )[0] ||
//     null

// //@ts-ignore
//   uname = uname?.textContent || ""
//   uname = getCleanText(uname)
//   document.getElementById("slider").querySelector("#sheaderheader").innerHTML =
//     "<h1>" + uname + "</h1>"
// }

// //module for extracting the details
// function extract() {
//   // retreiving profile Section data
//   const profileSection = document.querySelector(".pv-top-card")

//   const fullNameElement = profileSection?.querySelector("h1")
//   const fullName = fullNameElement?.textContent || null

//   const titleElement = profileSection?.querySelector(".text-body-medium")
//   let title = titleElement?.textContent || null

//   let tbs = profileSection?.querySelectorAll(".text-body-small")
//   const locationElement = tbs ? tbs[1] : null
//   let loc = locationElement?.textContent || null

//   const photoElement =
//     document.querySelector(".pv-top-card-profile-picture__image") ||
//     profileSection?.querySelector(".profile-photo-edit__preview")
//   const photo = photoElement?.getAttribute("src") || null

//   const descriptionElement = document
//     .querySelector("div#about")
//     ?.parentElement.querySelector(
//       ".pv-shared-text-with-see-more > div > span.visually-hidden"
//     ) // Is outside "profileSection"
//   let description = descriptionElement?.textContent || null

//   //@ts-ignore
//   const url = window.location.url
//   let rawProfileData = {
//     fullName,
//     title,
//     loc,
//     photo,
//     description,
//     url
//   }

//   let profileData = {
//     fullName: getCleanText(rawProfileData.fullName),
//     title: getCleanText(rawProfileData.title),
//     location: getCleanText(rawProfileData.loc),
//     description: getCleanText(rawProfileData.description),
//     photo: rawProfileData.photo,
//     url: rawProfileData.url
//   }
//   ///extraction of profile data ends here///

//   return profileData
// } //Extract() functions ends here

// // Save PDF document of a linkedinProfile
// function savePDF() {
//   let spanList = document.getElementsByTagName("span")
//   let m = []

//   for (let i = 0; i < spanList.length; i++) {
//     if (spanList[i].textContent == "Save to PDF") {
//       m.push(spanList[i])
//     }
//   }

//   if (m.length < 1) {
//     alert("No option to download profile.")
//   } else {
//     m[0].click()
//   }
// }

// // Extract license and certifications
// function extractCert() {
//   let anchor1 = document.getElementById("licenses_and_certifications")
//   let anchor2 = document.querySelector(".pvs-list")

//   let list = null
//   let certs = []

//   if (anchor1) {
//     //@ts-ignore
//     anchor1 = anchor1.nextElementSibling.nextElementSibling
//     list = anchor1.querySelector("ul").children
//   }

//   if (
//     anchor2 &&
//     //@ts-ignore
//     document.getElementById("deepscan").checked &&
//     location.href.includes("certifications")
//   ) {
//     list = anchor2.children
//   }

//   if (list) {
//     //if the anchor exists
//     for (let i = 0; i < list.length; i++) {
//       let elem = null
//       let firstdiv = null
//       let url = ""

//       //@ts-ignore
//       if (anchor1 && !document.getElementById("deepscan").checked) {
//         //alert("anchor1");
//         elem =
//           list[
//             i
//           ].firstElementChild.firstElementChild.nextElementSibling.querySelectorAll(
//             "div"
//           )

//         if (elem[0].querySelector("a")) {
//           firstdiv = elem[0].querySelector("a").children
//         } else {
//           firstdiv = elem[1].children
//         }

//         url = elem[4]?.querySelector("a")?.href || ""
//         //if anchor1
//       } else if (
//         anchor1 == null &&
//         anchor2 &&
//         //@ts-ignore
//         document.getElementById("deepscan").checked &&
//         location.href.includes("certifications")
//       ) {
//         //alert("anchor2s");
//         elem =
//           list[i].querySelector("div > div").firstElementChild
//             .nextElementSibling
//         firstdiv = elem.firstElementChild.firstElementChild.children

//         url =
//           elem.firstElementChild.nextElementSibling?.querySelector("a").href ||
//           ""
//       } //if anchor2
//       else {
//         break
//       }

//       //let condn = (firstdiv.querySelector('a'))? 'a >' : '';
//       let name = getCleanText(
//         firstdiv[0].querySelector("span > span")?.textContent || ""
//       )
//       let issuedby = getCleanText(
//         firstdiv[1].querySelector("span > span")?.textContent || ""
//       )
//       let issuedon = getCleanText(
//         firstdiv[2]?.querySelector("span > span")?.textContent || ""
//       )
//       let expiration = issuedon ? issuedon.split("·")[1] : ""
//       let issuedon = issuedon
//         ? issuedon.split("·")[0]?.split("Issued ")[1] || ""
//         : ""

//       let temp = {
//         id: i,
//         title: name,
//         issuer: issuedby,
//         date: issuedon,
//         expiration: expiration,
//         link: url
//       }

//       certs.push(temp)
//     } //for loop to scrape through the list
//   }
//   let objtemp = {
//     name: "licenses",
//     data: certs
//   }

//   document.getElementById("certificationstext").value = JSON.stringify(objtemp)
// } //license extraction ends here

// // Extract Skills
// function extractSkills() {
//   //defining anchors (roots from where scraping starts)
//   let anchor1 = document.getElementById("skills")
//   let anchor2 = document.querySelector(".pvs-list")

//   let list = null
//   let skills = []

//   if (anchor1 && !document.getElementById("deepscan").checked) {
//     anchor1 = anchor1.nextElementSibling.nextElementSibling
//     list = anchor1.querySelector("ul").children
//   }

//   if (
//     anchor2 &&
//     document.getElementById("deepscan").checked &&
//     location.href.includes("skills")
//   ) {
//     list = anchor2.children
//   }

//   if (list) {
//     //if the anchor exists
//     for (i = 0; i < list.length; i++) {
//       let elem = null
//       //let firstdiv = null;

//       if (anchor1 && !document.getElementById("deepscan").checked) {
//         //alert("anchor1");
//         elem =
//           list[
//             i
//           ].firstElementChild.firstElementChild.nextElementSibling.querySelectorAll(
//             "div"
//           )

//         let index = 0
//         elem = getCleanText(
//           elem[index]?.querySelector("div > span > span").textContent || ""
//         )
//       } // anchor1 ends here
//       else if (
//         anchor1 == null &&
//         anchor2 &&
//         document.getElementById("deepscan").checked &&
//         location.href.includes("skills")
//       ) {
//         elem =
//           list[i].querySelector("div > div").firstElementChild
//             .nextElementSibling
//         elem = elem.firstElementChild.firstElementChild.children

//         elem = getCleanText(
//           elem[0]?.querySelector("div > span > span").textContent || ""
//         )
//       } //anchor2 ends here
//       else {
//         //exit
//         break
//       }

//       skills.push({
//         id: i,
//         title: elem
//       })
//     } //for loop
//   } //if `the list from anchor exists` condn ends here

//   let objtemp = {
//     name: "skills",
//     data: skills
//   }

//   document.getElementById("skillstext").value = JSON.stringify(objtemp)
// } //Extraction of skills ends here

// // Extract Experience /////

// function extractExperience() {
//   //defining anchors (roots from where scraping starts)
//   let anchor1 = document.getElementById("experience")
//   let anchor2 = document.querySelector(".pvs-list")

//   let list = null
//   let exp = {}
//   let roles = []
//   let company = ""

//   if (anchor1 && !document.getElementById("deepscan").checked) {
//     anchor1 = anchor1.nextElementSibling.nextElementSibling
//     list = anchor1.querySelector("ul").children
//   }

//   if (
//     anchor2 &&
//     document.getElementById("deepscan").checked &&
//     location.href.includes("experience")
//   ) {
//     list = anchor2.children
//   }

//   if (list) {
//     //if the anchor exists
//     for (i = 0; i < list.length; i++) {
//       if (
//         document.getElementById("deepscan").checked &&
//         !location.href.includes("experience")
//       )
//         break
//       company = ""
//       roles = []

//       let elem = list[i].querySelector("div > div").nextElementSibling //for anchor 1
//       if (elem.querySelector("div > a")) {
//         // condition for multiple roles in same company
//         company =
//           elem.querySelector("div > a > div > span > span")?.textContent || ""
//         company = getCleanText(company)

//         elem = elem.firstElementChild.nextElementSibling
//         let elems = elem.querySelector("ul").children

//         for (j = 0; j < elems.length; j++) {
//           // traversing roles list in a company

//           let keke =
//             elems[j].querySelector("div > div")?.nextElementSibling || null
//           keke = keke?.querySelector("div > a") || null

//           kchilds = keke.children
//           let rname = " ",
//             startDate = " ",
//             endDate = " ",
//             loc = " "
//           for (k = 0; k < kchilds.length; k++) {
//             //each role's details taken
//             if (k == 0)
//               //role name
//               rname = kchilds[k]?.querySelector("span > span").textContent || ""
//             if (k == 1) {
//               //role duration
//               let ta = kchilds[k]
//                 .querySelector("span")
//                 .textContent.split(/[-·]/)
//               startDate = ta[0]
//               endDate = ta[1]
//             }
//             if (k == 2)
//               //role location
//               loc = kchilds[k].querySelector("span")?.textContent || ""
//           } //kloop

//           roles.push({
//             id: j,
//             title: getCleanText(rname),
//             startDate: getCleanText(startDate),
//             endDate: getCleanText(endDate),
//             location: getCleanText(loc)
//           })
//         } // role traversal loop
//       } else {
//         //condition when single role in one company
//         elem = elem.querySelector("div > div > div > div")

//         echilds = elem.children
//         let rname = " ",
//           startDate = " ",
//           endDate = " ",
//           loc = " "
//         for (k = 0; k < echilds.length; k++) {
//           //each role's details taken
//           if (k == 0)
//             //role name
//             rname = echilds[k]?.querySelector("span > span").textContent || ""
//           if (k == 2) {
//             //role duration
//             let ta = echilds[k].querySelector("span").textContent.split(/[-·]/)
//             startDate = ta[0]
//             endDate = ta[1]
//           }
//           if (k == 3)
//             //role location
//             loc = echilds[k].querySelector("span")?.textContent || ""

//           if (k == 1)
//             //role company title
//             company = echilds[k].querySelector("span")?.textContent || ""
//           if (company) company = company.split(/[-·]/)[0]
//         } //kloop

//         roles.push({
//           id: 0,
//           title: getCleanText(rname),
//           startDate: getCleanText(startDate),
//           endDate: getCleanText(endDate),
//           location: getCleanText(loc)
//         })
//       } //single role else condn ends

//       exp[i] = {
//         company: company,
//         roles: roles
//       }
//     } //for loop over 'i' for each item in anchor list
//   } // if list anchor exists condition

//   document.getElementById("experiencetext").value = JSON.stringify(exp)
// } //extract experience ends here

// // Extract Experience //

// function extractEducation() {
//   //defining anchors (roots from where scraping starts)
//   let anchor1 = document.getElementById("education")
//   let anchor2 = document.querySelector(".pvs-list")

//   let  list = null

//   if (anchor1 && !document.getElementById("deepscan").checked) {
//     anchor1 = anchor1.nextElementSibling.nextElementSibling
//     list = anchor1.querySelector("ul").children
//   }

//   if (
//     anchor2 &&
//     document.getElementById("deepscan").checked &&
//     location.href.includes("experience")
//   ) {
//     list = anchor2.children
//   }

//   if (list) {
//     //if the anchor exists
//     for (i = 0; i < list.length; i++) {
//       if (
//         document.getElementById("deepscan").checked &&
//         !location.href.includes("experience")
//       )
//         break
//     } // for loops
//   } // if
// } //extract education ends here

// //////////// *---- UTILS -----* //////////////
// // Utility functions

// function expandButtons() {
//   const expandButtonsSelectors = [
//     ".pv-profile-section.pv-about-section .lt-line-clamp__more", // About
//     "#experience-section .pv-profile-section__see-more-inline.link", // Experience
//     ".pv-profile-section.education-section button.pv-profile-section__see-more-inline", // Education
//     '.pv-skill-categories-section [data-control-name="skill_details"]' // Skills
//   ]

//   const seeMoreButtonsSelectors = [
//     '.pv-entity__description .lt-line-clamp__line.lt-line-clamp__line--last .lt-line-clamp__more[href="#"]',
//     '.lt-line-clamp__more[href="#"]:not(.lt-line-clamp__ellipsis--dummy)'
//   ]

//   for (const buttonSelector of expandButtonsSelectors) {
//     try {
//       if ($(buttonSelector) !== null) {
//         $(buttonSelector).click()
//       }
//     } catch (err) {
//       alert("Couldn't expand buttons")
//     }
//   }

//   for (const seeMoreButtonSelector of seeMoreButtonsSelectors) {
//     const buttons = $(seeMoreButtonSelector)

//     for (const button of buttons) {
//       if (button) {
//         try {
//           button.click()
//         } catch (err) {
//           alert("Error expanding see more buttons")
//         }
//       }
//     }
//   }
// }

// function getCleanText(text) {
//   const regexRemoveMultipleSpaces = / +/g
//   const regexRemoveLineBreaks = /(\r\n\t|\n|\r\t)/gm

//   if (!text) return null

//   const cleanText = text
//     .toString()
//     .replace(regexRemoveLineBreaks, "")
//     .replace(regexRemoveMultipleSpaces, " ")
//     .replace("...", "")
//     .replace("See more", "")
//     .replace("See less", "")
//     .trim()

//   return cleanText
// }

export {}
