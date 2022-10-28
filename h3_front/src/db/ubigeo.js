import axios from "axios";
import env from 'react-dotenv'

export function getDistritosByProvinciaDepartamento (provincia, departamento) {
    let url = `/values/${departamento}/${provincia}`

    let config = {
        url: url,
        baseURL: env.API_URL,
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    }

    return axios.get (url, config)
}


export function getProvinciasByDepartamento (departamento) {
    let url = `/values/${departamento}`

    let config = {
        url: url,
        baseURL: env.API_URL,
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    }

    return axios.get (url, config)
}


export function getDepartamentos () {
    let url = '/values'

    let config = {
        url: url,
        baseURL: env.API_URL,
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    }

    return axios.get (url, config)
}