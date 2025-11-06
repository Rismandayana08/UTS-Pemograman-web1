import { dataPengguna } from "./data.mjs";

const parent = document.getElementById("bodyUserTable")
dataPengguna.forEach((item)=>{
    const row = document.createElement("tr")

    row.innerHTML = `
    <td>${item.id}</td>
    <td>${item.email}</td>
    <td>${item.nama}</td>
    <td>${item.role}</td>
    `

    parent.appendChild(row)
})