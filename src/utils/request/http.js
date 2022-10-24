import axios from './axios'


//请求方法封装 
export function get(url) {

    return function (params) {
        return axios.get(url, {
            params
        }).then(res => {

            return res

        }).catch(error => {
            return error
        })
    }
}
//url拼接
export function get1(url) {

    return function (id) {
        return axios.get(url + id).then(res => {

            return res

        }).catch(error => {
            console.log(error);
            return error
        })
    }
}



export function post(url) {

    return function (data) {
        return axios.post(url, data).then(res => {

            return res

        }).catch(error => {

            return error

        })
    }
}

export function post1(url) {

    return function (data) {
        return axios.post(url, data, {
            responseType: "blob"
        }).then(res => {

            return res

        }).catch(error => {
            return error
        })
    }
}

export function post2(url) {

    return function (data) {
        return axios.post(url, data, {
            responseType: "arraybuffer"
        }).then(res => {

            return res

        }).catch(error => {
            console.log(error);
        })
    }
}

export function Delete(url) {

    return function (data) {
        return axios.delete(url, {
            data: JSON.stringify(data)
        }).then(res => {

            return res

        }).catch(error => {
            console.log(error);
            return error

        })
    }
}

export function put(url) {

    return function (data) {
        return axios.put(url,
            data
        ).then(res => {

            return res

        }).catch(error => {
            console.log(error);
            return error

        })
    }
}