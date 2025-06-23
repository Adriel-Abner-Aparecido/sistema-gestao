export const get = async (url) => {
    let response;
    let token;

    if (typeof window !== 'undefined') {
        // Perform localStorage action
        token = localStorage.getItem("applojaweb_token");
    }

    const requestOptions = {
        method: 'GET',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Origin, Access-Control-Allow-Methods, Access-Control-Allow-Headers, Authorization',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    };

    const request = new Request(url, requestOptions)

    const data = await fetch(request)
        .then(res => response = res.json())
        .catch(err => {
            console.error(err)
            response = 404
        })

    return response;
}

export const getPublic = async (url) => {
    let response;

    const requestOptions = {
        method: 'GET'
    };
    
    const request = new Request(url, requestOptions)

    const data = await fetch(request)
    .then(res => response = res.json())
    .catch(err => {
        console.error(err) 
        response = 404
    })

    return response;
}
export const post = async (url, dados) => {
    let response;
    let token = localStorage.getItem("applojaweb_token");

    console.log(token);

    const requestOptions = {
        method: 'POST',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Origin, Access-Control-Allow-Methods, Access-Control-Allow-Headers',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(dados)
    };

    const request = new Request(url, requestOptions)

    const data = await fetch(request)
        .then(res => response = res.json())
        .catch(err => console.error(err))

    return response;
}

export const postMercadoPago = async (url, dados) => {
    const token = localStorage.getItem("applojaweb_token");

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(dados)
    };

    const response = await fetch(url, requestOptions);
    const data = await response.json();

    return data;
};

export const put = async (url, dados) => {
    let response;
    let token = localStorage.getItem("applojaweb_token");

    const requestOptions = {
        method: 'PUT',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'PUT',
            'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Origin, Access-Control-Allow-Methods, Access-Control-Allow-Headers',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(dados)
    };

    const request = new Request(url, requestOptions)

    const data = await fetch(request)
        .then(res => response = res.json())
        .catch(err => console.error(err))

    return response;
}

export const remove = async (url) => {
    let response;
    let token = localStorage.getItem("applojaweb_token");

    const requestOptions = {
        method: 'DELETE',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Origin, Access-Control-Allow-Methods, Access-Control-Allow-Headers, Authorization',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    };

    const request = new Request(url, requestOptions)

    const data = await fetch(request)
        .then(res => response = res.json())
        .catch(err => {
            console.error(err)
            response = 404
        })

    return response;
}