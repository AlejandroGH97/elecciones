import env from 'react-dotenv'
import axios from 'axios'

export function getDataFromDistritoProvinciaDepartamento (distrito, provincia, departamento) {
    let url = `/data/${departamento}/${provincia}/${distrito}`

    let config = {
        url: url,
        baseURL: env.API_URL,
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    }

    return axios.get (url, config)
}


export  function getDataFromProvinciaDepartamento (provincia, departamento) {
    let url = `/data/${departamento}/${provincia}`

    let config = {
        url: url,
        baseURL: env.API_URL,
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    }

    return axios.get (url, config)
}


export function getDataFromDepartamento (departamento) {
    let url = `/data/${departamento}`

    let config = {
        url: url,
        baseURL: env.API_URL,
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    }

    return axios.get (url, config)
}