import axios from "axios"
const baseUrl = 'http://localhost:3001/persons'

const  getAll = () => {
    return axios.get(baseUrl)
}

const addContact = newperson =>{
    return axios.post(baseUrl, newperson)
}

const deleteContact = (id) => {
    return axios.delete(`${baseUrl}/${id}`)    
}

const replaceNumber = (id, newNumber) =>{
    return axios.put(`${baseUrl}/${id}`, newNumber)
}

export default {
    getAll,
    addContact,
    deleteContact,
    replaceNumber
}
