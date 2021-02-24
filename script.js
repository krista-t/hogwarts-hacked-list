"use strict";

window.addEventListener("DOMContentLoaded", init);

//placeholder array
let studentListArr = [];
// //UPDATE ACCORDING TO REMOVED
// document.querySelector(
//   ".studentNumber"
// ).textContent = `Student Number: ${studentListArr.length}`;

//Prototype for all students
const StudentList = {
  firstName: "",
  lastName: "",
  middleName: "",
  nickName: "",
  house: "",
  gender: "",
  blood: "",
};

function init() {
  loadJSON();
  document
    .querySelectorAll(".filter")
    .forEach((filter) => filter.addEventListener("click", selectFilter));
  document
    .querySelectorAll(".sort")
    .forEach((sort) => sort.addEventListener("click", sortBy));
}

//SELECTS VALUE OF ALL SORTING AND CALLS SORT FUNC
function sortBy(e) {
  const sortValue = e.target.value;
  // console.log(sortValue);
  const sortResult = getSortResult(sortValue);
}

//GETS SORTING BY ASC ORDER (alphabetically)
function getSortResult(value) {
  console.log(value);
  let sort = studentListArr;
  if (value === "firstName") {
    sort = studentListArr.sort(function (a, b) {
      if (a.firstName < b.firstName) {
        return -1;
      } else {
        return 1;
      }
    });
    console.log(sort);
  } else if (value === "lastName") {
    sort = studentListArr.sort(function (a, b) {
      if (a.lastName < b.lastName) {
        return -1;
      } else {
        return 1;
      }
    });
  } else if (value === "house") {
    sort = studentListArr.sort(function (a, b) {
      if (a.house < b.house) {
        return -1;
      } else {
        return 1;
      }
    });
  }
  //DISPLAY SORTED LIST
  displayStudent(sort);
}

//SELECTS VALUE OF ALL FILTERS AND CALLS FILTER FUNC
function selectFilter(e) {
  const filterValue = e.target.value;
  const filterResult = getFilterResults(filterValue);
}

//GET FILTERS BY HOUSE & REST house becomes value
function getFilterResults(house) {
  let filtered = studentListArr;
  if (house === "Ravenclaw") {
    filtered = studentListArr.filter(isRavenclaw);
  } else if (house === "Gryffindor") {
    filtered = studentListArr.filter(isGryffindor);
  } else if (house === "Slytherin") {
    filtered = studentListArr.filter(isSlytherin);
  } else if (house === "Hufflepuff") {
    filtered = studentListArr.filter(isHufflepuff);
  } else if (house === "girl") {
    filtered = studentListArr.filter(isGirl);
  } else if (house === "boy") {
    filtered = studentListArr.filter(isBoy);
  }
  //  TODO: EXPELLED IS TRUE

  //TODO: UPDATE NUMBER IN HEADER
  displayStudent(filtered);
}

function isRavenclaw(student) {
  if (student.house === "Ravenclaw") {
    return true;
  } else {
    return false;
  }
}

function isGryffindor(student) {
  if (student.house === "Gryffindor") {
    return true;
  } else {
    return false;
  }
}

function isSlytherin(student) {
  if (student.house === "Slytherin") {
    return true;
  } else {
    return false;
  }
}

function isHufflepuff(student) {
  if (student.house === "Hufflepuff") {
    return true;
  } else {
    return false;
  }
}

function isGirl(student) {
  if (student.gender === "girl") {
    return true;
  } else {
    return false;
  }
}

function isBoy(student) {
  if (student.gender === "boy") {
    return true;
  } else {
    return false;
  }
}

//async function
async function loadJSON() {
  const response = await fetch(
    "https://petlatkea.dk/2021/hogwarts/students.json"
  );
  const jsonData = await response.json();
  prepareObjects(jsonData);
}

//delegator
function prepareObjects(jsonData) {
  const newStudentList = jsonData.map(prepareObject);
  displayStudent(newStudentList);
  document.querySelector(".btn").addEventListener("click", openModal);
  document.querySelector(".close-btn").addEventListener("click", closeModal); //NOT WORKING
}

//NOT WORKING
function openModal() {
  document.querySelector("#modal").classList.remove("hide");
  getModalData(studentListArr);
}
function closeModal() {
  document.querySelector("#modal").classList.add("hide");
  getModalData(studentListArr);
}

//SKIPS TO LAST ONE IN ARr
function getModalData(studentListArr) {
  studentListArr.forEach((student) => {
    console.log(student);
    document.querySelector(".studentfirstName").textContent = student.firstName;
  });
}

function prepareObject(listedStudent) {
  let newList = listedStudent.fullname.trim();
  //find first and last space
  const firstSpace = newList.indexOf(" ");
  const lastSpace = newList.lastIndexOf(" ");

  //name first letter capital, rest lowercase
  let name = newList.substring(firstSpace, 0);
  let firstName =
    name.charAt(0).toUpperCase() + name.substring(1).toLowerCase();
  if (firstName == "") {
    firstName = newList.substring(lastSpace + 1);
  }

  //find middle name using space&make capitals where needed
  const middle = newList.substring(firstSpace + 1, lastSpace);
  let middleName =
    middle.charAt(0).toUpperCase() + middle.substring(1).toLowerCase();
  if (middleName.includes(" ") || middleName.includes('"')) {
    middleName = undefined;
  }

  //find nickname and remove ""
  let nickname = newList.substring(firstSpace + 1, lastSpace);
  let nickName;
  if (nickname.includes('"')) {
    nickName = nickname.substring(1, nickname.length - 1);
  }

  //find lastname using spaces&capitalize where needed
  const last = newList.substring(lastSpace + 1);
  let lastName = last.charAt(0).toUpperCase() + last.substring(1).toLowerCase();
  if (lastName.includes("-")) {
    lastName = lastName.split("-");
    lastName[1] =
      lastName[1].charAt(0).toUpperCase() +
      lastName[1].substring(1).toLowerCase();
    lastName = lastName.join("-");
  }

  //trim space in front of string&capitalize
  let trimStartHouse = listedStudent.house.trimStart();
  const house =
    trimStartHouse.charAt(0).toUpperCase() +
    trimStartHouse.substring(1).toLowerCase();

  //gender
  const gender = listedStudent.gender;

  //create object from protoype
  const newStudentList = Object.create(StudentList);

  newStudentList.firstName = firstName;
  newStudentList.middleName = middleName;
  newStudentList.nickName = nickName;
  newStudentList.lastName = lastName;
  newStudentList.house = house;
  newStudentList.gender = gender;

  //push in Arr
  studentListArr.push(newStudentList);

  return newStudentList;
}

//DISPLAY STUDENTS
function displayStudent(students) {
  // clear the list
  document.querySelector("main").innerHTML = " ";
  students.forEach(displaySingleStudent);
}
function displaySingleStudent(student) {
  const clone = document.querySelector("template").content.cloneNode(true);
  clone.querySelector(
    "[data-field=firstname]"
  ).textContent = `${student.firstName}`;
  clone.querySelector("[data-field=middlename]").textContent =
    student.middleName;
  clone.querySelector("[data-field=nickname]").textContent = student.nickName;
  clone.querySelector("[data-field=lastname]").textContent = student.lastName;
  clone.querySelector(
    "[data-field=house]"
  ).textContent = `HOUSE: ${student.house}`;
  //images- cleaned and cloned
  const img = clone.querySelector("#card img");
  img.src =
    "./images/" +
    student.lastName.toLowerCase() +
    "_" +
    student.firstName[0].substring(0, 1).toLowerCase() +
    ".png";

  if (student.firstName === "Padma") {
    img.src =
      "./images/" + student.lastName.toLowerCase() + "_" + "padma" + ".png";
  } else if (student.lastName === "Patil") {
    img.src =
      "./images/" +
      student.lastName.toLowerCase() +
      "_" +
      student.firstName.toLowerCase() +
      ".png";
  } else if (student.lastName === "Finch-Fletchley") {
    img.src =
      "./images/" +
      "fletchley" +
      "_" +
      student.firstName.substring(0, 1).toLowerCase() +
      ".png";
  } else if (student.firstName === "Leanne") {
    img.src =
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/140px-No_image_available.svg.png";
    img.style.borderColor = "#14075a";
  }

  // append clone to list
  document.querySelector("main").appendChild(clone);
}
