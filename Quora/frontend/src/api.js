import axios from 'axios';

const getToken = () => {
    const token = localStorage.getItem("token");
    return "Bearer " + token;
}


export const post = (url, data, onSuccess, onFailure) => {
    const token = getToken();
    axios({
        method: 'post', //you can set what request you want to be
        url: url,
        data: data,
        headers: {
            'authorization': token
        }
    })
        .then(response => {
            onSuccess(response);
        })
        .catch((error) => {
            console.log('Got error')
            // console.log('Error msg ', error.response.data);
            onFailure(error);
        });

}

export const put = (url, data, onSuccess, onFailure) => {
    const token = getToken();
    axios({
        method: 'put', //you can set what request you want to be
        url: url,
        data: data,
        headers: {
            'authorization': token
        }
    })
        .then(response => {
            onSuccess(response);
        })
        .catch((error) => {
            console.log('Got error')
            // console.log('Error msg ', error.response.data);
            onFailure(error);
        });

}


export const get = (url, id, onSuccess, onFailure) => {
    const token = getToken();
    axios({
        method: 'get', //you can set what request you want to be
        url: url + id,
        headers: {
            'authorization': token
        }

    })
        .then(response => {
            onSuccess(response);
        })
        .catch(error => {
            console.log('Error msg ', error.response.data);
            onFailure(error);
        });


}

export const call = (options) => {
    return new Promise((resolve, reject) => {
        if (!options.url || !options.method) {
            reject({
                result: "failure",
                message: "Missing Parameters"
            });
            return;
        }


        options.headers = (options.headers || {
            'Content-Type': 'application/json'
        });
        // mandatory
        options.headers['Authorization'] = 'Bearer ' + (localStorage.getItem('token') === "undefined" ? null : localStorage.getItem('token'))

        options.query = options.query || {};
        axios({
            params: options.query,
            headers: options.headers,
            data: options.data,
            method: options.method,
            url: options.url
        }).then((response) => {
            let data = response.data || {};
            if (data.result === "success") {
                resolve(data)
            } else if (data.result === "failure") {
                if (!!(data.response || {}).code) {
                    data.response = [data.response]
                }
                data.response = data.response || [{
                    code: "TOKENERROR"
                }];
                if (data.response[0].code === "TOKENERROR") {
                    localStorage.setItem('token', null);
                    window.location.pathname = "/";
                } else {
                    reject({
                        result: "failure",
                        message: data.response[0].message || "Some Error with the Server"
                    });
                }
            } else {
                reject({
                    result: "failure",
                    message: "Some Error with the Server"
                });
            }
        }).catch((err) => {
            console.log(err);
            reject({
                result: "failure",
                message: err.response.data
            });
            return;
        });
    });
}
