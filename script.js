"use strict";

window.addEventListener("DOMContentLoaded", init);

//placeholder array
let studentListArr = [];

//Prototype for all students
const StudentList = {
  firstName: "",
  lastName: "",
  middleName: "",
  nickName: "",
  house: "",
  gender: "",
};

function init() {
  loadJSON();
  document
    .querySelectorAll(".filter")
    .forEach((filter) => filter.addEventListener("click", selectFilter));
}

function selectFilter(e) {
  const filterValue = e.target.value;
  // console.log(filterValue);
  const filterResult = getFilterResults(filterValue);
  // displayStudent(filterResult);
}

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
  }

  displayStudent(filtered);
}

function isRavenclaw(student) {
  return student.house === "Ravenclaw";
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
  //add listeners to fiter and sort btns
  //MODAL NOT WORKING
  // document
  //   .querySelectorAll(".btn")
  //   .forEach((btn) => addEventListener("click", openModal));
  // document.querySelector(".close-btn").addEventListener("click", function () {
  //   document.querySelector("#modal").classList.add("hide");
  //   console.log(document.querySelector("#modal"));
  // });
}

//NOT WORKING
function openModal() {
  document.querySelector("#modal").classList.remove("hide");
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

  //UPDATE ACCORDING TO REMOVED
  document.querySelector(
    ".studentNumber"
  ).textContent = `Student Number: ${studentListArr.length}`;

  return newStudentList;
}

//make for each
function displayStudent(students) {
  // clear the list
  document.querySelector("main").innerHTML = " ";
  students.forEach(displaySingleStudent);
  console.log(students);
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
