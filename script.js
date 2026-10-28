const studentForm = document.getElementById("studentForm");
const studentList = document.getElementById("studentList");
const searchInput = document.getElementById("search");
const totalStudents = document.getElementById("totalStudents");
const formTitle = document.getElementById("formTitle");
const submitBtn = document.getElementById("submitBtn");
let students = [
    { id: 1, name: "Ali Ahmed", roll: "BSIT-001", marks: 85 },
    { id: 2, name: "Sara Khan", roll: "BSIT-002", marks: 92 },
    { id: 3, name: "Usman Malik", roll: "BSIT-003", marks: 67 }
];
let nextId = 4;
let editId = null;
function getGrade(marks) {
    if (marks >= 90) return "A+";
    else if (marks >= 80) return "A";
    else if (marks >= 70) return "B";
    else if (marks >= 60) return "C";
    else if (marks >= 50) return "D";
    else return "F";
}
function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        }[char];
    });
}
function displayStudents() {
    const query = searchInput.value.trim().toLowerCase();
    const filteredStudents = students.filter(function (student) {
        return (
            student.name.toLowerCase().includes(query) ||
            student.roll.toLowerCase().includes(query) ||
            getGrade(student.marks).toLowerCase().includes(query)
        );
    });
    studentList.innerHTML = "";
    filteredStudents.forEach(function (student, index) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${escapeHTML(student.name)}</td>
            <td>${escapeHTML(student.roll)}</td>
            <td>${student.marks}/100</td>
            <td>${getGrade(student.marks)}</td>
            <td>
                <button class="edit-btn" data-id="${student.id}">
                    Edit
                </button>
                <button class="delete-btn" data-id="${student.id}">
                    Delete
                </button>
            </td>
        `;
        studentList.appendChild(row);
    });
    totalStudents.textContent =
        `Total Students: ${students.length}`;
}
studentForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const name = document.getElementById("name").value.trim();
    const roll = document.getElementById("roll").value.trim();
    const marks = Number(document.getElementById("marks").value);
    if (!name || !roll || !/^\d+$/.test(
        document.getElementById("marks").value
    ) || marks < 0 || marks > 100) {
        alert("Please enter valid student details and marks from 0 to 100.");
        return;
    }
    const duplicateRoll = students.some(function (student) {
        return student.roll.toLowerCase() === roll.toLowerCase()
            && student.id !== editId;
    });
    if (duplicateRoll) {
        alert("This roll number already exists!");
        return;
    }
    if (editId !== null) {
        students = students.map(function (student) {
            if (student.id === editId) {
                return { id: editId, name, roll, marks };
            }
            return student;
        });
        editId = null;
    } else {
        students.push({
            id: nextId++,
            name,
            roll,
            marks
        });
    }
    studentForm.reset();
    formTitle.textContent = "Add New Student";
    submitBtn.textContent = "Add Student";
    displayStudents();
});
studentList.addEventListener("click", function (event) {
    const button = event.target.closest("button");
    if (!button) return;
    const id = Number(button.dataset.id);
    const student = students.find(function (item) {
        return item.id === id;
    });
    if (!student) return;
    if (button.classList.contains("edit-btn")) {
        document.getElementById("name").value = student.name;
        document.getElementById("roll").value = student.roll;
        document.getElementById("marks").value = student.marks;
        editId = student.id;
        formTitle.textContent = "Edit Student";
        submitBtn.textContent = "Update Student";
        document.getElementById("name").focus();
    }
    if (button.classList.contains("delete-btn")) {
        if (confirm(`Delete ${student.name}'s record?`)) {
            students = students.filter(function (item) {
                return item.id !== id;
            });
            if (editId === id) {
                editId = null;
                studentForm.reset();
                formTitle.textContent = "Add New Student";
                submitBtn.textContent = "Add Student";
            }
            displayStudents();
        }
    }
});
searchInput.addEventListener("input", displayStudents);
displayStudents();
