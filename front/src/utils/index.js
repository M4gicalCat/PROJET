import {API_ENDPOINT} from "../model";

export const api = async (route, data, ...params) => {
    const result = await (await fetch(`${API_ENDPOINT}${route}`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "PHPSESSID": getPHPSESSID(),
            "credentials": 'include',
        },
        body: JSON.stringify(data),
        ...params,
    })).json();
    if (result.err) {
        throw new Error(result.message);
    }
    return result;
}

const getPHPSESSID = () => {
    const cookie = document.cookie.split(';').find(cookie => cookie.startsWith('PHPSESSID'));
    return cookie ? cookie.split('=')[1] : '';
}