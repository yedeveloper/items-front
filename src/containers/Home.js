import React from 'react';
import axios from 'axios';
import Services from '../services'

export default class Home extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            items: [],
            nombreItem: '',
            isLogged: false,
            user: 'admin@admin.co',
            pass: 'admin12345'
        }
    }

    componentDidMount(){
        this.validateLogin();
        this.renderList();
    }

    validateLogin = () => {
        let tokenAc = localStorage.getItem('tokAu');
        if(tokenAc && tokenAc !== null){
            this.setState({isLogged: true});
        }
    }

    renderList = async () => {
        let service = new Services();
        const itemsServer = await service.getAll('getAll');
        if(itemsServer){
            if(itemsServer !== 'OFFLINE'){
                localStorage.setItem('itemList', JSON.stringify(itemsServer));
                this.setState({items: itemsServer});
            }else{
                alert("Error en la sesión");
            }
        }else{
            alert("No se pudo obtener la lista");
        }
    }

    setNombreItem = e => {
        this.setState({nombreItem: e.target.value});
    }

    clear = () => {
        this.setState({items: []});
        localStorage.clear();
    }

    addNewItem = () => {
        //Update local list
        if(this.state.items.length > 0){
            let itemsTemp = this.state.items;
            itemsTemp.push({
                nombre: this.state.nombreItem
            });
            localStorage.setItem('itemList', JSON.stringify(itemsTemp));
            this.setState({items: itemsTemp});
        }else{
            let toIn = [];
            toIn.push({
                nombre: this.state.nombreItem
            });
            localStorage.setItem('itemList', JSON.stringify(toIn));
            this.setState({items: toIn});
        }
        this.setState({nombreItem: ''});
        //create in server
        this.insertServer();
    }

    deleteItem = idItem => {
        //Update local
        let itemsTemp = this.state.items;
        itemsTemp.splice(itemsTemp.findIndex(v => v.nombre === idItem), 1);
        localStorage.setItem('itemList', JSON.stringify(itemsTemp));
        this.setState({items: itemsTemp});
        //Delete in server
        this.deleteServer(idItem);
    }

    logIn = async () => {
        const { user, pass } = this.state;
        if(user !== '' && pass !== ''){
            let service = new Services();
            const respServer = await service.login('login', {
                email: this.state.user,
                password: this.state.pass
            });
            if(respServer){
                if(respServer === 'OFFLINE'){
                    alert('No tienes conexión, debes conectarte e intentar nuevamente');
                }else{
                    this.setState({isLogged: true});
                    alert(respServer.message);
                }
            }else{
                alert('Ocurrio un error en la petición');
            }            
        }else{
            alert("Debes ingresar usuario y contraseña");
        }
    }

    closeSession = async () => {

        let service = new Services();
        const respServer = await service.logout('logout');
        if(respServer){
            if(respServer === 'OFFLINE'){
                alert('No tienes conexión, debes conectarte e intentar nuevamente');
            }else{
                this.setState({isLogged: false});
                alert(respServer.message);
            }
        }else{
            alert('Ocurrio un error en la petición');
        } 
    }

    insertServer = async () => {
        let toSend = [];
        toSend.push({nombre: this.state.nombreItem});
        let service = new Services();
        const respServer = await service.insertServer('newItem', toSend);
        if(respServer){
            if(respServer === 'OFFLINE'){
                localStorage.setItem('hasPending', true);
                alert('No tienes conexión, debes conectarte y pulsar sobre el botón Enviar lista');
            }else{
                alert(respServer.message);
            }
        }else{
            alert('Ocurrio un error en la petición');
        }
    }

    deleteServer = async idItem => {
        let service = new Services();
        const respServer = await service.deleteServer('deleteItem', idItem);
        if(respServer){
            if(respServer === 'OFFLINE'){
                localStorage.setItem('hasPending', true);
                alert('No tienes conexión, debes conectarte y pulsar sobre el botón Enviar lista');
            }else{
                alert(respServer.message);
            }
        }else{
            alert('Ocurrio un error en la petición');
        }
    }

    syncAll = async () => {
        let service = new Services();
        const respServer = await service.syncAll('syncAll', this.state.items);
        if(respServer){
            if(respServer === 'OFFLINE'){
                localStorage.setItem('hasPending', true);
                alert('No tienes conexión, debes conectarte y pulsar sobre el botón Enviar lista');
            }else{
                alert(respServer.message);
            }
        }else{
            alert('Ocurrio un error en la petición');
        }
    }

    render(){
        const { items, nombreItem, isLogged, user, pass } = this.state;
    
        return(
            <div className="container">
                {
                    (!isLogged) ?
                    <>
                    <h1>Logueate para ver tu lista</h1>
                    <div className="row">
                        <div className="col col-md-8 offset-md-2 mt-5">
                            <input type="text" className="form-control" value={user} onChange={(e) => this.setState({user: e.target.value})} />
                        </div>
                        <div className="col col-md-8 offset-md-2 mt-5">
                            <input type="password" className="form-control" value={pass} onChange={(e) => this.setState({pass: e.target.vale})} />
                        </div>
                        <div className="col col-md-12 mt-5">
                            <button onClick={() => {this.logIn()}} type="button" className="btn btn-outline-success">Ingresar</button>
                        </div>
                        <hr className="mt-5" />
                    </div>
                    </> : 
                    <>
                        <h1>Bienvenido a tu lista</h1>
                        <div className="col col-md-12 text-center">
                            <button onClick={() => {this.closeSession()}} className="btn btn-outline-danger">Cerrar Sesión</button>
                        </div>
                        <div className="row">
                            <div className="col col-md-6 offset-md-2 mt-5">
                                <input type="text" className="form-control" value={nombreItem} onChange={(e) => this.setNombreItem(e)} />
                            </div>
                            <div className="col col-md-3 mt-5">
                                <button onClick={() => {this.addNewItem()}} type="button" className="btn btn-outline-success">Agregar nuevo item</button>
                            </div>
                            <hr className="mt-5" />
                        </div>
                        <div className="row">
                            <div className="col col-md-12">
                                <table className="table table-striped table-dark mt-5">
                                    <thead>
                                        <tr>
                                            <th>Item</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            items.map((item, index) => {
                                                return(
                                                    <tr key={index}>
                                                        <td className="td-list">{item.nombre}</td>
                                                        <td className="td-list">
                                                            <button type="button" className="btn btn-outline-warning btn-list">Editar</button>
                                                            <button type="button" onClick={()=>{this.deleteItem(item.nombre)}} className="btn btn-outline-danger btn-list">Eliminar</button>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                                <hr className="mt-5" />
                                <div className="row">
                                    <div className="col col-md-12">
                                        <button onClick={() => {this.clear()}} type="button" className="btn btn-outline-danger">Limpiar lista</button>
                                        <button style={{marginLeft: '10px'}} onClick={() => {this.syncAll()}} type="button" className="btn btn-outline-success">Enviar lista</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                }
            </div>
        );
    }

}