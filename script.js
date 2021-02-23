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
};

function init() {
  //events for listeners

  loadJSON();
}

//async function
async function loadJSON() {
  const response = await fetch(
    "https://petlatkea.dk/2021/hogwarts/students.json"
  );
  const jsonData = await response.json();
  prepareObjects(jsonData);
}

function prepareObjects(jsonData) {
  const newStudentList = jsonData.map(prepareObject);
  displayStudent(newStudentList);
  // console.log(newStudentList);
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
    console.log(nickName);
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
  let house =
    trimStartHouse.charAt(0).toUpperCase() +
    trimStartHouse.substring(1).toLowerCase();

  //create object from protoype
  const newStudentList = Object.create(StudentList);

  newStudentList.firstName = firstName;
  newStudentList.middleName = middleName;
  newStudentList.nickName = nickName;
  newStudentList.lastName = lastName;
  newStudentList.house = house;
  console.log(middleName);
  //push in Arr
  studentListArr.push(newStudentList);
  // console.table(newStudentList);
  return newStudentList;
}

//make for each
function displayStudent(students) {
  console.log(students); //cleaned data
  students.forEach((student) => {
    const clone = document.querySelector("template").content.cloneNode(true);
    clone.querySelector(
      "[data-field=firstname]"
    ).textContent = `${student.firstName}`;
    clone.querySelector("[data-field=middlename]").textContent =
      student.middleName;
    clone.querySelector("[data-field=nickname]").textContent = student.nickName;
    clone.querySelector("[data-field=lastname]").textContent = student.lastName;
    // append clone to list
    document.querySelector("main").appendChild(clone);
  });
}

function filter() {
  //filter according to options and call display filtered
}

function sort() {
  //sort all acording to sor options and call display
}

function displayList() {
  //clear list
  //for each students display student
}
