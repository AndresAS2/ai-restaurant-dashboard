import {Component} from 'react';
export default class ErrorBoundary extends Component{
 state={error:false};
 static getDerivedStateFromError(){return {error:true};}
 render(){return this.state.error?<main className="panel max-w-lg mx-auto mt-16"><h1 className="text-xl">No se pudo mostrar esta pantalla</h1><p className="my-4">Recarga la página para intentarlo de nuevo.</p><button className="primary" onClick={()=>location.reload()}>Recargar</button></main>:this.props.children;}
}
