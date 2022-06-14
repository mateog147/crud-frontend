(()=>{
    const url = 'http://localhost:8080/usuario/'
    const $contenedor = document.querySelector('tbody')

    
    const modalUsuario = new bootstrap.Modal(document.getElementById('modalUsuario'))
    const formUsuario = document.querySelector('form')
    const nombre = document.getElementById('nombre')
    const email = document.getElementById('email')
    const prioridad = document.getElementById('prioridad')
    var opcion = ''
    
    btnCrear.addEventListener('click', ()=>{
        nombre.value = ''
        email.value = ''
        prioridad.value = ''
        modalUsuario.show()
        opcion = 'crear'
    })
    
    //funcion para mostrar los resultados
    const mostrar = (usuarios) => {

        if(usuarios.length == 0){
            alertify.alert("Ups", "No hay coincidencias");
            getData(url);
        }else{
            let resultados = ''
            while ($contenedor.firstChild) {
            $contenedor.removeChild($contenedor.firstChild);
        }
            usuarios.forEach(usuario => {
                resultados += `<tr>
                                    <td>${usuario.id}</td>
                                    <td>${usuario.nombre}</td>
                                    <td>${usuario.email}</td>
                                    <td>${usuario.prioridad}</td>
                                    <td class="text-center"><a class="btnEditar btn btn-primary">Editar</a><a class="btnBorrar btn btn-danger">Borrar</a></td>
                                </tr>
                            `    
            })
            $contenedor.innerHTML = resultados
        }

    }
    
    //Procedimiento Mostrar
    const getData = (path) => {fetch(path)
        .then( response => response.json() )
        .then( data => mostrar(data) )
        .catch( error => console.log(error))
    }
      
    const on = (element, event, selector, handler) => {

        element.addEventListener(event, e => {
            if(e.target.closest(selector)){
                handler(e)
            }
        })
    }
    
    //Procedimiento Borrar
    on(document, 'click', '.btnBorrar', e => {
        const fila = e.target.parentNode.parentNode
        const id = fila.firstElementChild.innerHTML
        alertify.confirm("Esta Seguro que quiere eliminar.",
        function(){
            fetch(url+id, {
                method: 'DELETE'
            })
            .then( res => res.json() )
            .then( ()=> location.reload())
            //alertify.success('Ok')
        },
        function(){
            alertify.error('Cancel')
        })
    })
    
    //Procedimiento Editar
    let idForm = 0
    on(document, 'click', '.btnEditar', e => {    
        const fila = e.target.parentNode.parentNode
        idForm = fila.children[0].innerHTML
        const nombreForm = fila.children[1].innerHTML
        const emailForm = fila.children[2].innerHTML
        const prioridadForm = fila.children[3].innerHTML
        nombre.value =  nombreForm
        email.value =  emailForm
        prioridad.value =  prioridadForm
        opcion = 'editar'
        modalUsuario.show()
         
    })
    
    //Procedimiento para Crear y Editar
    formUsuario.addEventListener('submit', (e)=>{
        e.preventDefault()
        if(opcion=='crear'){        
            //console.log('OPCION CREAR')
            fetch(url, {
                method:'POST',
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                    nombre:nombre.value,
                    email:email.value,
                    prioridad:prioridad.value
                })
            })
            .then( response => response.json() )
            .then( data => {
                const nuevoUsuario = []
                nuevoUsuario.push(data)
                getData(url)
            })
        }
        if(opcion=='editar'){    
            //console.log('OPCION EDITAR')
            fetch(url,{
                method: 'POST',
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                    id:idForm,
                    nombre:nombre.value,
                    email:email.value,
                    prioridad:prioridad.value
                })
            })
            .then( response => response.json() )
            .then( response => location.reload() )
        }
        modalUsuario.hide()
    })

    btnEmail.addEventListener("click", ()=>{
        const input = document.getElementById("emailInput");
        const email = input.value
        if(email != ""){
            const path = url + "email?email="+email;
            getData(path);
        }
        else{
            alertify.alert("Error","Ingresa un correo para buscar")
        }
        
    })

    btnDelteEmail.addEventListener("click", ()=>{
        const input = document.getElementById("emailInput");
        const email = input.value
        if(email != ""){
            alertify.confirm("Esta Seguro que quiere eliminar.",
            function(){
                fetch(url + "email?email="+email, {
                    method: 'DELETE'
                })
                .then(res=> console.log(res))
                //alertify.success('Ok')
                getData(url)
            },
            function(){
                alertify.error('Cancel')
            })
            
        }
        else{
            alertify.alert("Error","Ingresa un correo para buscar")
        }
        
    })
    
    getData(url);
    
})();
