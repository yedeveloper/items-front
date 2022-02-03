import axios from 'axios';

export default class Services{

    apiUrl = '';
    token = '';

    constructor(){
        this.apiUrl = 'http://localhost:8000/api/';
        this.setToken();
    }

    setToken(){
        let tokenAc = localStorage.getItem('tokAu');
        if(tokenAc && tokenAc !== null){
            this.token = tokenAc;
        }
    }

    validateConnection(){
        let isOnline = navigator.onLine ? true : false;
        return isOnline;
    }

    hasPendingData(){
        let hasPending = localStorage.getItem('hasPending');
        if(hasPending && hasPending !== null){
            return true;
        }else{
            return false;
        }
    }

    async login(url, data){
        let isOnline = this.validateConnection();
        if(isOnline){
            try {
                const respServer = await axios.post(this.apiUrl + url, data);
                if(respServer.status === 200){
                    localStorage.setItem('tokAu', respServer.data.access_token);
                    return respServer.data;
                }else{
                    return false;
                }
            } catch (error) {
                console.log(error);
                return false;
            }
        }else{
            return 'OFFLINE';
        }
    }

    async logout(url){
        let isOnline = this.validateConnection();
        if(isOnline){
            if(this.token !== ''){
                try {
                    const respServer = await axios.post(this.apiUrl + url,{},{
                        headers: { Authorization: `Bearer ${this.token}` }
                    });
                    if(respServer.status === 200){
                        localStorage.removeItem('tokAu');
                        return respServer.data;
                    }else{
                        return false;
                    }
                } catch (error) {
                    console.log(error);
                    return false;
                }
            }else{
                return false;
            }
        }else{
            return 'OFFLINE';
        }
    }

    async getAll(url){
        let isOnline = this.validateConnection();
        if(isOnline){
            if(this.token !== ''){
                try {
                    const respServer = await axios.get(this.apiUrl + url,{
                        headers: { Authorization: `Bearer ${this.token}` }
                    });
                    if(respServer.status === 200){
                        return respServer.data;
                    }else{
                        return false;
                    }
                } catch (error) {
                    console.log(error);
                    return false;
                }
            }else{
                return false;
            }
        }else{
            return 'OFFLINE';
        }
    }

    async syncAll(url, data){
        let hasPending = this.hasPendingData();
        if(hasPending){
            let isOnline = this.validateConnection();
            if(isOnline){
                if(this.token !== ''){
                    try {
                        const respServer = await axios.post(this.apiUrl + url, {
                            items: data
                        },{
                            headers: { Authorization: `Bearer ${this.token}` }
                        });
                        if(respServer.status === 200){
                            return respServer.data;
                        }else{
                            return false;
                        }
                    } catch (error) {
                        console.log(error);
                        return false;
                    }
                }else{
                    return false;
                }
            }else{
                return 'OFFLINE';
            }
        }else{
            return 'NOPENDING';
        }
    }

    async insertServer(url, dataInsert){
        let isOnline = this.validateConnection();
        if(isOnline){
            if(this.token !== ''){
                try {
                    const respServer = await axios.post(this.apiUrl + url, {
                        item: dataInsert
                    },{
                        headers: { Authorization: `Bearer ${this.token}` }
                    });
                    if(respServer.status === 200){
                        return respServer.data;
                    }else{
                        return false;
                    }
                } catch (error) {
                    console.log(error);
                    return false;
                }
            }else{
                return false;
            }
        }else{
            return 'OFFLINE';
        }
    }

    async deleteServer(url, idItem){
        let isOnline = this.validateConnection();
        if(isOnline){
            if(this.token !== ''){
                try {
                    const respServer = await axios.delete(this.apiUrl + url,{
                        headers: { Authorization: `Bearer ${this.token}` }
                    }, {
                        item: idItem
                    });
                    if(respServer.status === 200){
                        return respServer.data;
                    }else{
                        return false;
                    }
                } catch (error) {
                    console.log(error);
                    return false;
                }
            }else{
                return false;
            }
        }else{
            return 'OFFLINE';
        }
    }

    async updateServer(url, idItem){
        let isOnline = this.validateConnection();
        if(isOnline){
            if(this.token !== ''){
                try {
                    const respServer = await axios.put(this.apiUrl + url, {
                        item: idItem
                    },{
                        headers: { Authorization: `Bearer ${this.token}` }
                    });
                    if(respServer.status === 200){
                        return respServer.data;
                    }else{
                        return false;
                    }
                } catch (error) {
                    console.log(error);
                    return false;
                }
            }else{
                return false;
            }
        }else{
            return 'OFFLINE';
        }
    }

}