

//////////INICIAN ESTRUCTURAS DE DATOS//////////

////////////////////////////////////////////////////////////////////////////////EMPIEZA ARBOL AVL //////////////////////////////////////////////////////////////////////////////////////////


class NodeAVL {
    constructor(dato, nombre) {
        this.dato = dato;
        this.nombre = nombre;
        this.Previous = null;
        this.Next = null;
    }
}

class Avl {
    constructor() {
        this.raiz = null;
        this.altura = -1;
        this.equilibrio = 0;
    }

    insertar(dato) {
        var nuevo;
        nuevo = new NodeAVL(dato);

        if (this.raiz === null) {
            this.raiz = nuevo;
            this.raiz.Previous = new Avl();
            this.raiz.Next = new Avl();
        } else {
            if (dato.id_pelicula > this.raiz.dato.id_pelicula) {
                this.raiz.Next.insertar(dato);
            } else {
                if (dato.id_pelicula < this.raiz.dato.id_pelicula) {
                    this.raiz.Previous.insertar(dato);
                } else {
                    console.log("el valor ya existe");
                }
            }
        }

        this.balancear();
    }

    balancear() {
        this.actualizarAlturas({
            "recursivo": false
        });
        this.actualizarEquilibrio(false);

        while (this.equilibrio < -1 || this.equilibrio > 1) {
            if (this.equilibrio > 1) {
                if (this.raiz.Previous.equilibrio < 0) {
                    this.raiz.Previous.rotacionziquierda();
                    this.actualizarAlturas();
                    this.actualizarEquilibrio();
                }

                this.rotacionDerecha();
                this.actualizarAlturas();
                this.actualizarEquilibrio();
            }

            if (this.equilibrio < -1) {
                if (this.raiz.Next.equilibrio > 0) {
                    this.raiz.Next.rotacionDerecha();
                    this.actualizarAlturas();
                    this.actualizarEquilibrio();
                }

                this.rotacionziquierda();
                this.actualizarAlturas();
                this.actualizarEquilibrio();
            }
        }
    }

    actualizarAlturas(recursivo = true) {
        if (this.raiz === null) {
            this.altura = -1;
        } else {
            if (recursivo) {
                if (this.raiz.Previous !== null) {
                    this.raiz.Previous.actualizarAlturas();
                }

                if (this.raiz.Next !== null) {
                    this.raiz.Next.actualizarAlturas();
                }
            }
            this.altura = Math.max(this.raiz.Previous.altura, this.raiz.Next.altura) + 1;
        }
    }

    actualizarEquilibrio(recursivo = true) {
        if (this.raiz === null) {
            this.equilibrio = 0;
        } else {
            if (recursivo) {
                if (this.raiz.Previous !== null) {
                    this.raiz.Previous.actualizarEquilibrio();
                }

                if (this.raiz.Next !== null) {
                    this.raiz.Next.actualizarEquilibrio();
                }
            }

            this.equilibrio = this.raiz.Previous.altura - this.raiz.Next.altura;
        }
    }

    rotacionDerecha() {
        var raiz;
        raiz = this.raiz;
        this.raiz = raiz.Previous.raiz;
        raiz.Previous.raiz = this.raiz.Next.raiz;
        this.raiz.Next.raiz = raiz;
    }

    rotacionziquierda() {
        var raiz;
        raiz = this.raiz;
        this.raiz = raiz.Next.raiz;
        raiz.Next.raiz = this.raiz.Previous.raiz;
        this.raiz.Previous.raiz = raiz;
    }

    graficarArbol(raiz) {
        var acumuladores;
        acumuladores = ["digraph G{\nlabel=\"Peliculas\"\nnode [shape=rectangle];\n", ""];
        if (raiz !== null) {
            this.recorrerArbol(raiz, acumuladores);
        }
        acumuladores[0] += acumuladores[1] + "\n}";

        //console.log(acumuladores[0]);      
        d3.select("#lienzoAVL").graphviz()
            .width("900")
            .height("500")
            .fit(true)
            .renderDot(acumuladores[0])
    }

    recorrerArbol(raiz, acum) {
        if (raiz) {
            acum[1] += "\"" + (raiz.dato.id_pelicula) + "\"[label=\"" + raiz.dato.id_pelicula + "\"];\n";

            if (raiz.Previous.raiz !== null) {
                acum[1] += "\"" + (raiz.dato.id_pelicula) + "\" -> \"" + (raiz.Previous.raiz.dato.id_pelicula) + "\";\n";
            }

            if (raiz.Next.raiz !== null) {
                acum[1] += "\"" + (raiz.dato.id_pelicula) + "\" -> \"" + (raiz.Next.raiz.dato.id_pelicula) + "\";\n";
            }

            this.recorrerArbol(raiz.Previous.raiz, acum);
            this.recorrerArbol(raiz.Next.raiz, acum);
        }
    }

}


var peliculasAvl = new Avl()
var salida =document.getElementById("movies")

class pelicula {
    constructor(id_pelicula, nombre_pelicula, descripcion, puntuacion_star, precio_Q) {
        this.id_pelicula = id_pelicula;
        this.nombre_pelicula = nombre_pelicula;
        this.descripcion = descripcion;
        this.puntuacion_star = puntuacion_star;
        this.precio_Q = precio_Q;
    }
}


function CargaMasivaPeliculas(e){
    var archivo =e.target.files[0];
    
    //si no encuentra el archivo
    if (!archivo){
        return;
    }
  
    let lector=new FileReader();
    lector.onload=function(e){
        let contenido = e.target.result;
        
        //crea el objeto json
        const objeto=JSON.parse(contenido);
        console.log(objeto);
  
        //para mandarlo a la estructura
        for (const key in objeto){
            let peliculas =objeto[key]
            peliculasAvl.insertar(new pelicula(peliculas.id_pelicula, peliculas.nombre_pelicula, peliculas.descripcion, peliculas.puntuacion_star, peliculas.precio_Q));
        }

        
        
        for (const key in objeto){
            let peliculas2 =objeto[key]
            listaPeliculas.append(peliculas2.id_pelicula, peliculas2.nombre_pelicula , peliculas2.descripcion , peliculas2.puntuacion_star, peliculas2.precion_Q, peliculas2.categoria)
            nombrePeliculas.push(peliculas2.nombre_pelicula);

           
        }

        alert("Archivo cargado Exitosamente")
        
       
        
   
    }
    
  
    lector.readAsText(archivo);
  
  
  }
  
  document.getElementById("jsonpeliculas").addEventListener("change", CargaMasivaPeliculas, false)

////////////////////////////////////////////////////////////////////////////////TERMINA ARBOL AVL /////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////EMPIEZA LISTA SIMPLE //////////////////////////////////////////////////////////////////////////////////////

class Node {
    constructor(dpi,nombre_completo,nombre_usuario,correo,contrasenia,telefono) {
        this.dpi = dpi;
        this.nombre_completo = nombre_completo;
        this.nombre_usuario = nombre_usuario;
        this.correo = correo;
        this.contrasenia = contrasenia;
        this.telefono = telefono;
        this.next = null;
    }
}


class ListaSimple{

constructor() {
    this.head = null;
    this.size = 0;
}

/* Inserta un nodo al frente de la lista */
push(dpi,nombre_completo,nombre_usuario,correo,contrasenia,telefono) {
var new_node = new Node(dpi,nombre_completo,nombre_usuario,correo,contrasenia,telefono);
new_node.next = this.head;
this.head = new_node;
this.size++;
}

/* Inserta un nodo en la posisión siguiente */
append(dpi,nombre_completo,nombre_usuario,correo,contrasenia,telefono) {

var new_node = new Node(dpi,nombre_completo,nombre_usuario,correo,contrasenia,telefono);

if (this.head == null) {
    this.head = new Node(dpi,nombre_completo,nombre_usuario,correo,contrasenia,telefono);
    this.size++;
    return;
}


 new_node.next = null;

var last = this.head;
while (last.next != null)
    last = last.next;
    last.next = new_node;
    this.size++;
    return;
}

deleteNode(key) {
    var temp = this.head, prev = null;

    // Si el propio nodo de cabecera tiene la clave que hay que borrar
    if (temp != null && temp.nombre_usuario == key) {
        this.head = temp.next; // Cambiando la cabeza
        return;
    }

    // Buscar la clave que se va a eliminar, mantener la pista de el nodo anterior ya que necesitamos cambiar temp.next
    while (temp != null && temp.nombre_usuario != key) {
        prev = temp;
        temp = temp.next;
    }

    // Si la clave no está en la lista
    if (temp == null)
        return;

    // Quitando el nodo de la lista
    prev.next = temp.next;
}

getCount() {
    var temp = this.head;
    var count = 0;
    while (temp != null) {
        count++;
        temp = temp.next;
    }
    return count;
}

// para buscar la informacion en la lista
buscar(indice){
    let aux = this.head 
    while (aux!=null){
        if(aux.nombre_usuario == indice){
            //document.write("Si aparece "+aux.nombre_usuario)
            
            return aux
        }
        aux = aux.next
    }
    //document.write("No aparece ")      
    return this
}

printList() {
var tnode = this.head;
    while (tnode != null) {
        document.write(tnode.dpi + " " + tnode.nombre_completo + " " + tnode.nombre_usuario + " " + tnode.correo + " " + tnode.contrasenia + " " + tnode.telefono + "<br>");
        tnode = tnode.next;
    }
}

//graficar con graphviz 
graficarlista(){
        var codigodot = "digraph G{\nlabel=\" Lista Simple - Clientes \";\nnode [shape=box];\n";
        var temporal = this.head
        var conexiones ="";
        var nodos ="";
        var numnodo= 0;
        while (temporal != null) {
            nodos+=  "N" + numnodo + "[label=\"" +"Dpi: "+ temporal.dpi+"\n Nombre: " +temporal.nombre_completo+"\n Usuario: "+temporal.nombre_usuario+ "\n Correo: " +temporal.correo + "\n Contraseña: " +temporal.contrasenia +  "\n Telefono: " +temporal.telefono + "\" ];\n"
            if(temporal.next != null){
                var auxnum = numnodo+1
                conexiones += "N" + numnodo + " -> N" + auxnum + ";\n"
            }
            temporal = temporal.next
            numnodo++;            
        }
        codigodot += "//agregando nodos\n"
        codigodot += nodos+"\n"
        codigodot += "//agregando conexiones o flechas\n"
        codigodot += "{rank=same;\n"+conexiones+"\n}\n}"
        console.log(codigodot)
        //var arreglo = [0,2,3,4,5]
        d3.select("#lienzoListaUsuarios").graphviz()
            .width(900)
            .height(500)
            .renderDot(codigodot)
}



}

var listaUsuarios = new ListaSimple()


function CargaMasivaUsuarios(e){
    var archivo =e.target.files[0];
    
    //si no encuentra el archivo
    if (!archivo){
        return;
    }
  
    let lector=new FileReader();
    lector.onload=function(e){
        let contenido = e.target.result;
        
        //crea el objeto json
        const objeto=JSON.parse(contenido);
        console.log(objeto);
  
        //para mandarlo a la estructura
        for (const key in objeto){
            let usuario =objeto[key]
            listaUsuarios.append(usuario.dpi,usuario.nombre_completo,usuario.nombre_usuario,usuario.correo,usuario.contrasenia,usuario.telefono)
        }
  
        
        
        alert("Archivo cargado Exitosamente")
        
        
        
   
    }
    
  
    lector.readAsText(archivo);
   
  
}
  
  document.getElementById("jsonusuarios").addEventListener("change", CargaMasivaUsuarios, false)



////////////////////////////////////////////////////////////////////////////////TERMINA LISTA SIMPLE //////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////APARTADO DE ACTORES //////////////////////////////////////////////////////////////////////////////////////////////



class autor{
    constructor(dni, nombre, correo, descripcion){
        this.dni=dni
        this.nombre=nombre
        this.correo=correo
        this.descripcion=descripcion
    }

}

class nodoBinario {
    constructor(autor) {
        this.autor = autor
        this.izq = null
        this.der = null
    }
}

class abb {
    constructor() {
        this.raiz = null
    }
    insertar(autor) {
        let aux = new nodoBinario(autor)
        if (this.raiz == null) {
            this.raiz = aux
        } else {
            this.raiz = this.insertarNodo(this.raiz, aux)
        }
    }

    devolverRaiz() {
        return this.raiz
    }

    insertarNodo(raizActual, aux) {
        if (raizActual != null) {
            if (raizActual.autor.dni > aux.autor.dni) {
                raizActual.izq = this.insertarNodo(raizActual.izq, aux)
            } else if (raizActual.autor.dni < aux.autor.dni) {
                raizActual.der = this.insertarNodo(raizActual.der, aux)
            } else {
                console.log("Ese man ya existe")
            }
            return raizActual
        } else {
            raizActual = aux
            return raizActual
        }
    }


    cadenNodos(raizActual) {
        let nodos = ""
        if (raizActual != null) {
            nodos += "n" + raizActual.autor.dni + "[label=\"" + raizActual.autor.nombre + "\"]\n"
            nodos += this.cadenNodos(raizActual.izq)
            nodos += this.cadenNodos(raizActual.der)
        }
        return nodos
    }

    enlazar(raizActual) {
        let cadena = ""
        if (raizActual != null) {
            cadena += this.enlazar(raizActual.izq)
            cadena += this.enlazar(raizActual.der)
            if (raizActual.izq != null) {
                cadena += "n" + raizActual.autor.dni + "-> n" + raizActual.izq.autor.dni + "\n"
            }
            if (raizActual.der != null) {
                cadena += "n" + raizActual.autor.dni + "-> n" + raizActual.der.autor.dni + "\n"
            }
        }
        return cadena
    }

    buscar(x) {
        var nombre = x.toLocaleLowerCase()
        var namee = nombre.replace(/ /g, "")
        var xcomp = this.buscador(this.raiz, namee)
        if (xcomp == "Existe") {
            var comp = this.buscarAutor(this.raiz, namee)
            alert("Si existe")
            return (comp)
        } else {
            alert("No existe")
            return (0)
        }
    }
    buscarAutor(raiz, b) {
        var nombrex = raiz.autor.nombre
        var nombres = nombrex.toLocaleLowerCase()
        var namees = nombres.replace(/ /g, "")
        if (raiz === null) {
            return null;
        } else if (b < namees) {
            return this.buscarAutor(raiz.izq, b);
        } else if (b > namees) {
            return this.buscarAutor(raiz.der, b);
        }
        else {
            return raiz.autor;
        }
    }

    buscador(raiz, b) {
        if (raiz != null) {
            var nombrex = raiz.autor.nombre
            var nombres = nombrex.toLocaleLowerCase()
            var namees = nombres.replace(/ /g, "")
            var x = this.buscador(raiz.izq, b)
            var y = this.buscador(raiz.der, b)
            if (namees == b || x == "Existe" || y == "Existe") {
                return ("Existe")
            }
        }
    }
    inOrden(raiz_actual) {
        if (raiz_actual != null) {
            this.inOrden(raiz_actual.izq)
            inOrden.insertar(raiz_actual.autor)
            this.inOrden(raiz_actual.der)
        }
    }
    preorden(raiz_actual) {
        if (raiz_actual != null) {
            preorden.insertar(raiz_actual.autor)
            this.preorden(raiz_actual.izq)
            this.preorden(raiz_actual.der)
        }
    }
    postOrden(raiz_actual) {
        if (raiz_actual != null) {
            this.postOrden(raiz_actual.izq)
            this.postOrden(raiz_actual.der)
            postOrden.insertar(raiz_actual.autor)
        }
    }

    metodos(){
        this.inOrden(this.raiz)
        this.preorden(this.raiz)
        this.postOrden(this.raiz)
    }
    grafInOr(){
        inOrden.graficar()
    }
    grafPreOr(){
        preorden.graficar()
    }
    grafPostOr(){
        postOrden.graficar()
    }
}

/////////////////////////AQUI EMPIEZA LA LISTA QUE LUEGO SE INGRESARA EN EL ARBOL  BINARIO/////////////////////////////////////////


class nodoListaActores {
    constructor(objetoValor) {
        this.valor = objetoValor;
        this.siguiente = null;
    }
}

class listaActores {
    constructor() {
        this.cabeza = null;
        this.contador = 0;
    }

    insertar(objetico) {
        if (this.cabeza == null) {
            this.cabeza = new nodoListaActores(objetico);
            this.contador = this.contador + 1;
        } else {
            var actual = this.cabeza;
            while (actual.siguiente) {
                actual = actual.siguiente;
            }
            actual.siguiente = new nodoListaActores(objetico);
            this.contador = this.contador + 1;
        }
    }

    graficar() {
        var actual = this.cabeza
        var texto = ""
        var textoActores = document.getElementById("divActores")
        textoActores.innerHTML=''
        while (actual != null) {
            texto += `
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title"> NOMBRE: ${actual.valor.nombre}</h5>
                        <p class="card-text"> DESCRIPCIÓN: ${actual.valor.descripcion}.</p>
                    </div>
                </div>

            `
            actual = actual.siguiente;
        }

        textoActores.innerHTML = texto;
    }
}

var arbolActor = new abb()
var inOrden = new listaActores()
var postOrden = new listaActores()
var preorden = new listaActores()
////////////////////////////////////////////////////////////////////////////////TERMINA APARTADO DE ACTORES //////////////////////////////////////////////////////////////////////////////////////





////////////////////////////////////////////////////////////////////////////////EMPIEZA ARBOL BINARIO //////////////////////////////////////////////////////////////////////////////////////


class NodoArbol{
    constructor(dato){
        //"dato" puede ser de cualquier tipo, incluso un objeto si se sobrescriben los operadores de comparación
       this.dato = dato
       this.izquierda = null
       this.derecha = null
    }
      
}

nodosBinario= ""
conexionesBinario = ""


class Arbol{
   // Funciones privadas
   constructor(){
       this.raiz = null
       
  }
      
   
   agregar_recursivo(nodo, dato){

       if(this.raiz == null) {
           // si la lista está vacía agrega el dato al inicio de la cola
           this.raiz = new NodoArbol(dato);
           return
       }
   

        if (dato < nodo.dato){
           if (nodo.izquierda == null){
               nodo.izquierda =new NodoArbol(dato)
           }
               
           else{
               this.agregar_recursivo(nodo.izquierda, dato)
           }
               
        }
           
       else{

           if (nodo.derecha == null){
               nodo.derecha = new NodoArbol(dato)
           }
               
           else{
               this.agregar_recursivo(nodo.derecha, dato)
           }
               
       }
           
   }
      


   
   inorden_recursivo(nodo){
       

       if (nodo != null){

           this.inorden_recursivo(nodo.izquierda)
           let nodoTempo=nodo.dato
           //nodos
           nodosBinario+=('"' +nodoTempo +'"' + "[label=\""+nodoTempo+"\" ];\n");
           console.log('"' +nodoTempo +'"' + "[label=\""+nodoTempo+"\" ];\n");
           
           let izquierda=nodo.izquierda

           //conecciones a la izquierda
           if (nodo.izquierda!=null){
               conexionesBinario+=('"' +nodoTempo+'"' + " -> " +'"'+izquierda.dato+'"' + "[arrowhead =null ];\n")
               console.log('"' +nodoTempo+'"' + " -> " +'"'+izquierda.dato+'"' + "[arrowhead =null ];\n")
           }
               
           //conecciones derecha    
           let derecha=nodo.derecha    
           if (nodo.derecha!=null){
               conexionesBinario+=('"' +nodoTempo+'"' + " -> " +'"'+derecha.dato +'"' + "[arrowhead =null ];\n")
               console.log('"' +nodoTempo+'"' + " -> " +'"'+derecha.dato +'"' + "[arrowhead =null ];\n")
           }
               
               
           
           this.inorden_recursivo(nodo.derecha)

           
           return
       }
       //console.log(nodos)
       //console.log(conexiones)
       return 
   
   }
   
   preorden_recursivo(nodo){

       if (nodo!= null){
           console.log(nodo.dato+ ", ")

           let nodoTempo=nodo.dato
           //nodos
           nodosBinario+=('"' +nodoTempo +'"' + "[label=\""+nodoTempo+"\" ];\n");
           console.log('"' +nodoTempo +'"' + "[label=\""+nodoTempo+"\" ];\n");
           
           let izquierda=nodo.izquierda

           //conecciones a la izquierda
           if (nodo.izquierda!=null){
               conexionesBinario+=('"' +nodoTempo+'"' + " -> " +'"'+izquierda.dato+'"' + "[arrowhead =null ];\n")
               console.log('"' +nodoTempo+'"' + " -> " +'"'+izquierda.dato+'"' + "[arrowhead =null ];\n")
           }
               
           //conecciones derecha    
           let derecha=nodo.derecha    
           if (nodo.derecha!=null){
               conexionesBinario+=('"' +nodoTempo+'"' + " -> " +'"'+derecha.dato +'"' + "[arrowhead =null ];\n")
               console.log('"' +nodoTempo+'"' + " -> " +'"'+derecha.dato +'"' + "[arrowhead =null ];\n")
           }



           this.preorden_recursivo(nodo.izquierda)
           this.preorden_recursivo(nodo.derecha)

       }
           
   }
       
   postorden_recursivo(nodo){
       if (nodo!= null){

           this.postorden_recursivo(nodo.izquierda)
           this.postorden_recursivo(nodo.derecha)

           let nodoTempo=nodo.dato
           //nodos
           nodosBinario+=('"' +nodoTempo +'"' + "[label=\""+nodoTempo+"\" ];\n");
           console.log('"' +nodoTempo +'"' + "[label=\""+nodoTempo+"\" ];\n");
           
           let izquierda=nodo.izquierda

           //conecciones a la izquierda
           if (nodo.izquierda!=null){
               conexionesBinario+=('"' +nodoTempo+'"' + " -> " +'"'+izquierda.dato+'"' + "[arrowhead =null ];\n")
               console.log('"' +nodoTempo+'"' + " -> " +'"'+izquierda.dato+'"' + "[arrowhead =null ];\n")
           }
               
           //conecciones derecha    
           let derecha=nodo.derecha    
           if (nodo.derecha!=null){
               conexionesBinario+=('"' +nodoTempo+'"' + " -> " +'"'+derecha.dato +'"' + "[arrowhead =null ];\n")
               console.log('"' +nodoTempo+'"' + " -> " +'"'+derecha.dato +'"' + "[arrowhead =null ];\n")
           }
           console.log(nodo.dato+", ")
       }
           
   }
       
   

   buscar(nodo, busqueda){

       if (nodo == null){
           return null
       }
           
       if (nodo.dato == busqueda){
           return nodo
       }
           
       if (busqueda < nodo.dato){
           return this.buscar(nodo.izquierda, busqueda)
       }
           
       else{
           return this.buscar(nodo.derecha, busqueda)
       }
           
   }

   
       

   // Funciones públicas

   agregar(dato){
        this.agregar_recursivo(this.raiz, dato)
   }
      

   enviarNombreArbol(){
       var namePodcast;

       namePodcast=document.getElementById("nombre").value;
       arbol.agregar(namePodcast)
       alert("Agregado")
       console.log(arbol)
   }



   graficar(){
       this.inorden_recursivo(this.raiz)


       //("Imprimiendo árbol en orden: ")
       var codigodot = "digraph G{\nlabel=\" Arbol binario \";\nnode [];\n";

     

       codigodot += "//agregando nodos\n"
       codigodot+=nodosBinario
       codigodot += "//agregando conexiones o flechas\n"
       codigodot += conexionesBinario+"\n\n}"

       
       console.log(codigodot)
       console.log(this.nodosBinario)
       
       d3.select("#lienzoBinarioActores").graphviz()
           .width(900)
           .height(500)
           .renderDot(codigodot)

           nodosBinario= ""
           conexionesBinario = ""
   }
       

   

   buscar2(busqueda){
       return this.buscar(this.raiz, busqueda)
   }
       

}

var arbolActores = new Arbol()


function CargaMasivaActores(e){
    var archivo =e.target.files[0];
    
    //si no encuentra el archivo
    if (!archivo){
        return;
    }
  
    let lector=new FileReader();
    lector.onload=function(e){
        let contenido = e.target.result;
        
        //crea el objeto json
        const objeto=JSON.parse(contenido);
        console.log(objeto);
  
        //para mandarlo a la estructura
        for (const key in objeto){
            let actor =objeto[key]
            arbolActores.agregar(actor.dni)
        }

        for (const key in objeto){
            let nuevoActor =objeto[key]
            var newActor = new autor(nuevoActor.dni, nuevoActor.nombre_actor, nuevoActor.correo, nuevoActor.descripcion)
            arbolActor.insertar(newActor)
        }

      
        arbolActor.metodos()
  
        alert("Archivo cargado Exitosamente")
   
    }
    
  
    lector.readAsText(archivo);
  
  
  }
  
  document.getElementById("jsonactores").addEventListener("change", CargaMasivaActores, false)

function graficarInorden() {
    arbolActor.grafInOr();
}

function graficarPreorden() {
    arbolActor.grafPreOr()
}

function graficarPostOrden() {
    arbolActor.grafPostOr()
}

////////////////////////////////////////////////////////////////////////////////TERMINA ARBOL BINARIO //////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////EMPIEZA TABLA HASH /////////////////////////////////////////////////////////////////////////////////////////

class NodoHash {
    constructor(dato) {
        this.dato = dato;
        this.siguiente = null;
        this.anterior = null;
        this.lista = new Tabla();
    }
}

class Tabla{
    constructor() {
        this.primero = null;
    }

    // método para crear la lista normal
    add(dato) {
        let nuevo = new NodoHash(dato);
        if(this.primero == null) {
            // si la lista está vacía agrega el dato al inicio de la cola
            this.primero = nuevo;
        }else {
            let aux = this.primero;
            // mientras el nodo aux no sea null, pasará al siguiente nodo
            while(aux.siguiente != null) {
                aux = aux.siguiente;
            }
            //let repetido = this.repetido(dato, this.primero);
            //if(repetido) {
            //    console.log('Dato repetido, no se insertó: ' + dato + ' :(');
            //    return
            //}
            // insertando el nuevo dato y asignando los apuntadores
            aux.siguiente = nuevo;
            nuevo.anterior = aux;
        }
    }

    // método para insertar dentro de una lista 
    add2(nombre, dato) {
        let aux = this.primero;
        while(aux != null) {
            // si el nombre es igual al algún dato de la lista se incerta otra lista dentro de ese nodo
            if (aux.dato == nombre) {
                //let repetido = this.repetido(dato, aux.lista.primero);
                //if (repetido) {
                //    aux.lista.add(dato);
                //    console.log('Dato repetido, no se insertó: ' + dato);
                //}else {
                    aux.lista.add(dato);
                //}                
                return
            }
            aux = aux.siguiente;
        }
        // si sale del while quiere decir que no hay tal nombre
        console.log('No existe ese nombre:( intente con otro.');
    }

    // método para verificar si hay algún dato repetido
    repetido(dato, aux) {
        while(aux != null) {
            if(aux.dato == dato) {
                return true;
            }
            aux = aux.siguiente;
        }
        return false;
    }

    // método para mostrar la lista
    mostrar() {
        let aux = this.primero;
        //console.log('=========LISTA=======');
        document.write('=========LISTA======='+"<br>");
        while(aux != null) {
            //console.log('* ' + aux.dato);
            document.write('* ' + aux.dato+"<br>");
            let aux2 = aux.lista.primero;
            while(aux2 != null) {
                //console.log('   -> ' + aux2.dato);
                document.write('   -> ' + aux2.dato+"<br>");
                aux2 = aux2.siguiente;
            }
            aux = aux.siguiente;
        }
    }

    // para buscar la informacion en la lista
    buscar(indice){
        let aux = this.primero 
        while (aux!=null){
            if(aux.dato == indice){
                document.write("Si aparece "+aux.dato)
                
                return aux
                }

            aux = aux.siguiente
            
        }
            
            
            
        return this
    }



    //graficar con graphviz 
    graficartabla(){
        var codigodot = 'digraph G { label=" Tabla Hash";node [shape=box]; \n '+' a0 [label=< <TABLE border="0"  cellpadding="10" bgcolor="white">\n';
        var temporal = this.primero
        var conexiones ="";
        var conexiones2="";
        var nodos ="";
        var numnodo= 0;
        while (temporal != null) {
            //nodos+=  "N" + numnodo + "[label=\"" + temporal.dato + "\" ];\n"

            var numnodo2= 0;
            nodos+=' <TR><TD border="3" style="radial" bgcolor="white"  gradientangle="60"> ' + temporal.dato + '</TD>     \n'
            
            
            //para la lista 2
            let temporal2=temporal.lista.primero

            //conexiones += "N" + numnodo + " -> NN" + temporal.dato + "0;\n"
            while(temporal2!=null){
                //nodos+=  "NN" + temporal.dato +numnodo2 + "[label=\"" + temporal2.dato + "\" ];\n"
                nodos+='<TD border="3" style="radial" bgcolor="white"  gradientangle="60"> ' + temporal2.dato + '</TD>'

                if(temporal2.siguiente!=null){
                    var auxnum2 = numnodo2+1
                //conexiones+= "NN" + temporal.dato +numnodo2 + " -> NN" +temporal.dato + auxnum2 + ";\n"
                    

                }

                
                temporal2 = temporal2.siguiente
                numnodo2++; 
            }
            






            
            //if(temporal.siguiente != null){
               // var auxnum = numnodo+1
                //conexiones2 += "N" + numnodo + " -> N" + auxnum + ";\n"
            //}


            temporal = temporal.siguiente
            nodos+='</TR>'
            numnodo++;            
        }
        //codigodot += "//agregando nodos\n"
        codigodot += nodos+'</TABLE>>];}'
        //codigodot += "//agregando conexiones o flechas\n"
        //codigodot += conexiones2+"{rank=same;\n"+conexiones+"\n}\n}"
        console.log(codigodot)
        //var arreglo = [0,2,3,4,5]
        d3.select("#lienzoTablaCategoria").graphviz()
            .width(900)
            .height(1500)
            .renderDot(codigodot)
    }

    insertar(modulo,dato){
        let indice=modulo%20
        this.add2(indice,dato)

    }
}

var tablaCategoria = new Tabla()

tablaCategoria.add('0');
tablaCategoria.add('1');
tablaCategoria.add('2');
tablaCategoria.add('3');
tablaCategoria.add('4');
tablaCategoria.add('5');
tablaCategoria.add('6');
tablaCategoria.add('7');
tablaCategoria.add('8');
tablaCategoria.add('9');
tablaCategoria.add('10');
tablaCategoria.add('11');
tablaCategoria.add('12');
tablaCategoria.add('13');
tablaCategoria.add('14');
tablaCategoria.add('15');
tablaCategoria.add('16');
tablaCategoria.add('17');
tablaCategoria.add('18');
tablaCategoria.add('19');



function CargaMasivaCategorias(e){
    var archivo =e.target.files[0];
    
    //si no encuentra el archivo
    if (!archivo){
        return;
    }
  
    let lector=new FileReader();
    lector.onload=function(e){
        let contenido = e.target.result;
        
        //crea el objeto json
        const objeto=JSON.parse(contenido);
        console.log(objeto);
  
        //para mandarlo a la estructura
        for (const key in objeto){
            let categoria =objeto[key]
            tablaCategoria.insertar(categoria.id_categoria, categoria.company)
        }
        
        var texto = ""
        for (const key in objeto){
            let categoria =objeto[key]
            
            var textoCategoria = document.getElementById("dibujoCategoria")
            textoCategoria.innerHTML = ""
            texto += `
            <div class="col-sm-6">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Categoria ${categoria.id_categoria}</h5>
                        <p class="card-text">${categoria.company}</p>
                    </div>
                </div>
            </div>
            
            `
        }
        textoCategoria.innerHTML = texto

        alert("Archivo cargado Exitosamente")
        
        
        
   
    }
    
  
    lector.readAsText(archivo);
  
  
  }
  
document.getElementById("jsoncategorias").addEventListener("change", CargaMasivaCategorias, false)


////////////////////////////////////////////////////////////////////////////////TERMINA TABLA HASH /////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////INICIA LISTA PELICULAS //////////////////////////////////////////////////////////////////////////////////////



class NodoListaPelicula {
    constructor(id_pelicula,nombre_pelicula,descripcion,puntuacion_star,precion_Q,paginas,categoria) {
        this.id_pelicula = id_pelicula;
        this.nombre_pelicula = nombre_pelicula;
        this.descripcion = descripcion;
        this.puntuacion_star = puntuacion_star;
        this.precion_Q = precion_Q;
        this.paginas = paginas;
        this.categoria = categoria;
        this.next = null;
    }
}


class ListaSimple2{

constructor() {
    this.head = null;
    this.size = 0;
}

/* Inserta un nodo al frente de la lista */
push(id_pelicula,nombre_pelicula,descripcion,puntuacion_star,precion_Q,paginas,categoria) {
var new_node = new NodoListaPelicula(id_pelicula,nombre_pelicula,descripcion,puntuacion_star,precion_Q,paginas,categoria);
new_node.next = this.head;
this.head = new_node;
this.size++;
}

/* Inserta un nodo en la posisión siguiente */
append(id_pelicula,nombre_pelicula,descripcion,puntuacion_star,precion_Q,paginas,categoria) {

var new_node = new NodoListaPelicula(id_pelicula,nombre_pelicula,descripcion,puntuacion_star,precion_Q,paginas,categoria);

if (this.head == null) {
    this.head = new NodoListaPelicula(id_pelicula,nombre_pelicula,descripcion,puntuacion_star,precion_Q,paginas,categoria);
    this.size++;
    return;
}


 new_node.next = null;

var last = this.head;
while (last.next != null)
    last = last.next;
    last.next = new_node;
    this.size++;
    return;
}

deleteNode(key) {
    var temp = this.head, prev = null;

    // Si el propio nodo de cabecera tiene la clave que hay que borrar
    if (temp != null && temp.nombre_pelicula == key) {
        this.head = temp.next; // Cambiando la cabeza
        return;
    }

    // Buscar la clave que se va a eliminar, mantener la pista de el nodo anterior ya que necesitamos cambiar temp.next
    while (temp != null && temp.nombre_pelicula != key) {
        prev = temp;
        temp = temp.next;
    }

    // Si la clave no está en la lista
    if (temp == null)
        return;

    // Quitando el nodo de la lista
    prev.next = temp.next;
}

getCount() {
    var temp = this.head;
    var count = 0;
    while (temp != null) {
        count++;
        temp = temp.next;
    }
    return count;
}

// para buscar la informacion en la lista
buscar(indice){
    let aux = this.head 
    while (aux!=null){
        if(aux.nombre_pelicula == indice){
            console.log("Si aparece "+aux.nombre_pelicula)
            
            return aux
        }
        aux = aux.next
    }
    console.log("No aparece ")      
    return this
}

printList() {
var tnode = this.head;
    while (tnode != null) {
        document.write(tnode.id_pelicula + " " + tnode.nombre_pelicula + " " + tnode.descripcion + " " + tnode.puntuacion_star + " " + tnode.precion_Q + " " + tnode.categoria + "<br>");
        tnode = tnode.next;
    }
}

peliAscendente() {
    var fin=null
    
    
            while(fin!=this.head){
    
                var primero, segundo
                primero=this.head
                segundo=this.head
    
                while(segundo.next!=fin){
    
                    var  tercero=segundo.next

                    if(segundo.nombre_pelicula > tercero.nombre_pelicula){
    
                        segundo.next=tercero.next
                        tercero.next=segundo 

                        if(segundo!=this.head){

                            primero.next=tercero
                        }
                        else{
                            this.head=tercero
                        }
    
    
                        var aux =segundo
    
                        segundo=tercero
    
                        tercero=aux
    
                    }
    
                    primero=segundo
                    segundo=segundo.next
    
                }
            
    
                fin=segundo
            }
}

peliDescendente() {
    var fin=null
    
    
            while(fin!=this.head){
    
                var primero, segundo
                primero=this.head
                segundo=this.head
    
                while(segundo.next!=fin){
    
                    var  tercero=segundo.next

                    if(segundo.nombre_pelicula < tercero.nombre_pelicula){
    
                        segundo.next=tercero.next
                        tercero.next=segundo 

                        if(segundo!=this.head){

                            primero.next=tercero
                        }
                        else{
                            this.head=tercero
                        }
    
    
                        var aux =segundo
    
                        segundo=tercero
    
                        tercero=aux
    
                    }
    
                    primero=segundo
                    segundo=segundo.next
    
                }
            
    
                fin=segundo
            }
}

metodoUno() {
    this.peliAscendente()
    var actual = this.head
    var table = "<table class='table shadow-sm'>";
    for (let i = 0; i < this.size; i++) {
        
            table += "<tr>";
            table += `<th scope="col">
                <FONT FACE="Cambria Bold" SIZE=7 COLOR="black">${actual.nombre_pelicula}</FONT> &nbsp; 
                <br></br>
                <FONT SIZE=4 COLOR="blue">Descripción:</FONT><FONT SIZE=3>${actual.descripcion}</FONT>
                <br></br>
                <FONT SIZE=4 COLOR="green" >Precio:Q.${actual.precion_Q}</FONT>
                <br></br>
                <button type="button" class="btn btn-light" data-bs-toggle="modal" data-bs-target="#ver-paciente" onclick="listaPeliculas.verPeli(${actual.id_pelicula})"><i class="bi bi-eye-fill"></i> INFO</button>
                <button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#edit-paciente" onclick="comprarPeli(${actual.id_pelicula})"><i class="bi bi-cash-stack"></i> COMPRAR</button>
                
            
            </th>`;
            table += "</tr>";
        
            actual = actual.next
    }
    table += "</table>";
    $("#pelisDiv").html(table);
}

metodoDos() {
    this.peliDescendente()
    var actual = this.head
    var table = "<table class='table shadow-sm'>";
    for (let i = 0; i < this.size; i++) {
        
            table += "<tr>";
            table += `<th scope="col">
                <FONT FACE="Cambria Bold" SIZE=7 COLOR="black">${actual.nombre_pelicula}</FONT> &nbsp; 
                <br></br>
                <FONT SIZE=4 COLOR="blue">Descripción:</FONT><FONT SIZE=3>${actual.descripcion}</FONT>
                <br></br>
                <FONT SIZE=4 COLOR="green" >Precio:Q.${actual.precion_Q}</FONT>
                <br></br>
                <button type="button" class="btn btn-light" data-bs-toggle="modal" data-bs-target="#ver-paciente" onclick="listaPeliculas.verPeli(${actual.id_pelicula})"><i class="bi bi-eye-fill"></i> INFO</button>
                <button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#edit-paciente" onclick="comprarPeli(${actual.id_pelicula})"><i class="bi bi-cash-stack"></i> COMPRAR</button>
                
            
            </th>`;
            table += "</tr>";
        
            actual = actual.next
    }
    table += "</table>";
    $("#pelisDiv").html(table);

    
}


verPeli(index) {
    var actual = this.head
    while (actual != null) {
        if (actual.id_pelicula == index) {
            var data = `                                    
                <strong><h1>${actual.nombre_pelicula}</h1></strong><br>
                <strong><label>Descripcion:</strong> ${actual.descripcion}</label><br>
                <strong><label>Estrellas: <strong>${actual.puntuacion_star}</label><br>
                <strong><label>Precio:</strong> Q ${actual.precion_Q}</label><br>
                <button type="button" class="btn btn-light text-muted mr-2" data-bs-toggle="modal" data-bs-target="#edit-paciente" onclick="comprarPeli(${actual.id_pelicula})"><i class="bi bi-cart-fill"></i></button><br>
                <strong><label>Cambiar Valoracion: </strong> <input type="text" id="${index}"> </label>
                <button type="button" class="btn btn-warning" onclick="cambiarValoracion(${index})"><i class="bi bi-star-fill"></i></button><br> 
                <strong><label>Comentarios: </strong></label><br>
                <table class="table" id="tablaComentarios"></table>
                `;
            data += ` 
                <strong><label>Usuario:</strong></label>                             
                <input type="text" id="userr"></input><br> 
                <strong><label>Comentario:</strong></label>
                <input type="text" id="comment"></input>
                <button onclick="crearComentario();crearTabla(comentariosDataBase);mostrarTabla()"><i class="bi bi-chat-left-text-fill"></i></button>
                `;
            $("#paciente-data").html(data);
        }
        actual = actual.next
    }


}





cambiarEstrellas(index, valorNuevo) {
    var actual = this.head
    while (actual != null) {
        if (actual.id_pelicula == index) {
            actual.puntuacion_star = valorNuevo
            alert("La calificación ha sido cambiada!")
            this.verPeli(index)
        }
        actual = actual.next
    }
   
}


}

let listaPeliculas = new ListaSimple2()
var nombrePeliculas = []
var comentarios = []
////////////////////////////////////////////////////////////////////////////////TERMINA LISTA PELICULAS //////////////////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////////////////EMPIEZA BLOCKCHAIN //////////////////////////////////////////////////////////////////////////////////////

textoBlockchain = "digraph G{"
var contador=0

class Block{
    constructor(index,data,previusHash=''){
        this.index = index;
        this.date = new Date();
        this.data = data;
        this.previusHash = previusHash;
        this.hash = this.createHash();
        this.nonce = 0;
    }
    
    createHash(){
        return CryptoJS.SHA256(this.index + this.date + this.previusHash + this.nonce).toString()
    }

    mine(difficulty){
        while(!this.hash.startsWith(difficulty)){
            this.nonce ++;
            this.hash = this.createHash();
        }
    }

}

class BlockChain{
    constructor(genesis, difficulty="00"){
        this.chain = [this.createFirtsBlock(genesis)]
        this.difficulty = difficulty;
    }

    createFirtsBlock(genesis){
        return new Block(0,genesis)
    }

    getLastBlock(){
        return this.chain[this.chain.length-1];
    }

    addBlock(data){
        let prevBlock = this.getLastBlock();
        let block = new Block(prevBlock.index+1,data,prevBlock.hash);
        block.mine(this.difficulty);
        console.log('Minado! ' +block.hash+ 'con nonce ' + block.nonce)
        this.chain.push(block);
        
        
        textoBlockchain += `label=" Blockchain ";`
        textoBlockchain += `node [shape=box];
                  //agregando nodos
                  N${contador}[label="Bloque: ${block.index}
                  `
        contador ++;
        textoBlockchain += `Hash: ${block.hash}
                  Prev: ${block.previusHash}
                  Transacciones: ${block.data}
                  Nonce: ${block.nonce}
                  Fecha: ${block.date} " ];
                `
        
                
    }

    isValid(){
        for(let i=1;i<this.chain.length;i++){
            let prevBlock = this.chain[i-1];
            let currBlock = this.chain[i];

            if(currBlock.previusHash != prevBlock.hash)
                return false
            
            if(currBlock.createHash() != currBlock.hash)
                return false;
            
        }
        return true;
    }

    
    
}








////////////////////////////////////////////////////////////////////////////////TERMINA BLOCKCHAIN //////////////////////////////////////////////////////////////////////////////////////


//FUNCIONES GENERALES

console.log(listaPeliculas)


function login(){
    
    var user, password;
    var marcado = document.getElementById("exampleCheck1").checked;
    user=document.getElementById("usuario").value;
    password=document.getElementById("contrasenia").value;
  
  
    var UsuarioX= listaUsuarios.buscar(user);
    
    if(marcado){
        if(user=="EDD" && password=="12345678"  ){
        
            alert("INICIO DE SESION CORRECTO PARA ADMINISTRADOR")  
            showDivAdministrador();
        }else{
            alert("CREDENCIALES INCORRECTAS PARA ADMINISTRADOR")
        }
    }
    else{
        if(user==UsuarioX.nombre_usuario && password==UsuarioX.contrasenia ){
            alert("BIENVENIDO: "+UsuarioX.nombre_usuario)
            showDivUsuario();
            //window.location = "ejemplo.html";
            
        }
      
        else{
            alert("Credenciales Incorrectas")
        }  

    }
    
    
 
  }
  
  
  function logout(){
    
    alert("Sesion cerrada")
    showDivIniciales()
    
  }
  




function mostrarGrafica1(){

    document.getElementById('grafica1').style.display = 'block';
    document.getElementById('grafica2').style.display = 'none';
    document.getElementById('grafica3').style.display = 'none';
    document.getElementById('grafica4').style.display = 'none';
}

function mostrarGrafica2(){

    document.getElementById('grafica1').style.display = 'none';
    document.getElementById('grafica2').style.display = 'block';
    document.getElementById('grafica3').style.display = 'none';
    document.getElementById('grafica4').style.display = 'none';
}

function mostrarGrafica3(){

    document.getElementById('grafica1').style.display = 'none';
    document.getElementById('grafica2').style.display = 'none';
    document.getElementById('grafica3').style.display = 'block';
    document.getElementById('grafica4').style.display = 'none';
}

function mostrarGrafica4(){

    document.getElementById('grafica1').style.display = 'none';
    document.getElementById('grafica2').style.display = 'none';
    document.getElementById('grafica3').style.display = 'none';
    document.getElementById('grafica4').style.display = 'block';
}


const $boton = document.querySelector("#btnCapturar") // El botón que desencadena

function capturarPeliculas(){
    $objetivo = document.querySelector("#lienzoAVL"), // A qué le tomamos la foto
    $contenedorCanvas = document.querySelector("#screen"); // En dónde ponemos el elemento canvas

    // Agregar el listener al botón
    $boton.addEventListener("click", () => {
    html2canvas($objetivo) // Llamar a html2canvas y pasarle el elemento
        .then(canvas => {
        // Cuando se resuelva la promesa traerá el canvas
        $contenedorCanvas.appendChild(canvas); // Lo agregamos como hijo del div
        });
    });
    alert("Grafica de peliculas capturada")
    
}

const $boton2 = document.querySelector("#btnCapturar2") // El botón que desencadena
function capturarClientes(){
    $objetivo = document.querySelector("#lienzoListaUsuarios"), // A qué le tomamos la foto
    $contenedorCanvas = document.querySelector("#screen2"); // En dónde ponemos el elemento canvas

    // Agregar el listener al botón
    $boton2.addEventListener("click", () => {
    html2canvas($objetivo) // Llamar a html2canvas y pasarle el elemento
        .then(canvas => {
        // Cuando se resuelva la promesa traerá el canvas
        $contenedorCanvas.appendChild(canvas); // Lo agregamos como hijo del div
        });
    });
    alert("Grafica de clientes capturada")

}

const $boton3 = document.querySelector("#btnCapturar3") // El botón que desencadena
function capturarActores(){
    $objetivo = document.querySelector("#lienzoBinarioActores"), // A qué le tomamos la foto
    $contenedorCanvas = document.querySelector("#screen3"); // En dónde ponemos el elemento canvas

    // Agregar el listener al botón
    $boton3.addEventListener("click", () => {
    html2canvas($objetivo) // Llamar a html2canvas y pasarle el elemento
        .then(canvas => {
        // Cuando se resuelva la promesa traerá el canvas
        $contenedorCanvas.appendChild(canvas); // Lo agregamos como hijo del div
        });
    });
    alert("Grafica de actores capturada")


}

const $boton4 = document.querySelector("#btnCapturar4") // El botón que desencadena
function capturarCategorias(){
    $objetivo = document.querySelector("#lienzoTablaCategoria"), // A qué le tomamos la foto
    $contenedorCanvas = document.querySelector("#screen4"); // En dónde ponemos el elemento canvas

    // Agregar el listener al botón
    $boton4.addEventListener("click", () => {
    html2canvas($objetivo) // Llamar a html2canvas y pasarle el elemento
        .then(canvas => {
        // Cuando se resuelva la promesa traerá el canvas
        $contenedorCanvas.appendChild(canvas); // Lo agregamos como hijo del div
        });
    });
    alert("Grafica de categorias capturada")

}




function download_image(){
    var canvas = document.getElementById('screen').querySelector('canvas');
    image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    var link = document.createElement('a');
    link.download = "peliculas.png";
    link.href = image;
    link.click();
}

function download_image2(){
    var canvas = document.getElementById('screen2').querySelector('canvas');
    image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    var link = document.createElement('a');
    link.download = "clientes.png";
    link.href = image;
    link.click();
}

function download_image3(){
    var canvas = document.getElementById('screen3').querySelector('canvas');
    image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    var link = document.createElement('a');
    link.download = "actores.png";
    link.href = image;
    link.click();
}


function download_image4(){
    var canvas = document.getElementById('screen4').querySelector('canvas');
    image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    var link = document.createElement('a');
    link.download = "categorias.png";
    link.href = image;
    link.click();
}


window.cambiarValoracion = function cambiarValoracion(index) {
    var antigua = index
    var nueva = String(document.getElementById(index).value)
    if (nueva >= 1 && nueva <= 5) {
        listaPeliculas.cambiarEstrellas(antigua, nueva)
    } else {
        alert("Ingrese una valoración valida")
    }

    
}

var comentariosDataBase = []


function objComentario(usuario,comentario){
    this.usuario = usuario
    this.comentario = comentario


}



function crearComentario(){
    var usuario = String(document.getElementById("userr").value)
    var comentario = String(document.getElementById("comment").value)
    var nuevoComentario = new objComentario(usuario,comentario)
    comentariosDataBase.push(nuevoComentario)
    alert("Comentario realizado")
   

}



function crearTabla(lista){
    var stringTabla = "<tr><th>Usuario</th><th>Comentario</th></tr>"
    for(let comment of lista){
        let fila = "<tr>"
        fila += "<td>" + comment.usuario + "</td>"
        fila += "<td>" + comment.comentario + "</td>"
        fila += "</tr>"
        stringTabla += fila;
    }
    
    return stringTabla
    
}

function mostrarTabla(){
    document.getElementById("tablaComentarios").innerHTML = crearTabla(comentariosDataBase)

}


function showDivIniciales(){
    document.getElementById('login').style.display = '';
    document.getElementById('admin').style.display = 'none';
    document.getElementById('user').style.display = 'none';
    document.getElementById('apartadoImagenes').style.display = 'none';
    document.getElementById('screen').style.display = 'none';
    document.getElementById('screen2').style.display = 'none';
    document.getElementById('screen3').style.display = 'none';
    document.getElementById('screen4').style.display = 'none';
    
  }
  
  function showDivAdministrador(){
    document.getElementById('admin').style.display = '';
    document.getElementById('user').style.display = 'none';
    document.getElementById('login').style.display = 'none';
    document.getElementById('apartadoImagenes').style.display = '';
    document.getElementById('screen').style.display = '';
    document.getElementById('screen2').style.display = '';
    document.getElementById('screen3').style.display = '';
    document.getElementById('screen4').style.display = '';
  }
  
  function showDivUsuario(){
    document.getElementById('admin').style.display = 'none';
    document.getElementById('user').style.display = '';
    document.getElementById('login').style.display = 'none';
    document.getElementById('apartadoImagenes').style.display = 'none';
    document.getElementById('screen').style.display = 'none';
    document.getElementById('screen2').style.display = 'none';
    document.getElementById('screen3').style.display = 'none';
    document.getElementById('screen4').style.display = 'none';
    
  }

  function limpiarInicioDeSesion(){
    document.getElementById("formInicioSesion").reset();
  }

 

  peliculasCompradas = []

function comprarPeli(id){
    var actual = listaPeliculas.head
    while (actual != null) {
        if (actual.id_pelicula == id) {
                peliculasCompradas.push(actual.nombre_pelicula)
                naniCoin.addBlock(peliculasCompradas)
        }
        actual = actual.next
    }
    alert("Pelicula comprada con exito!!")

}

function graficarBlockchain(){
        
    textoBlockchain += "}"

    d3.select("#divBlock").graphviz()
        .width(900)
        .height(500)
        .renderDot(textoBlockchain)

    return textoBlockchain; 
     
 }

 var miIntervalo;

 function minarAhora(){
    var vacio = " *** "
    peliculasCompradas.push(vacio)
    naniCoin.addBlock(peliculasCompradas)
    console.log("Un nuevo bloque ha sido minado!.");
 }

 function cambiarIntervalo(nuevoTiempo) {
    clearInterval(miIntervalo);
    var nuevoTiempo = document.getElementById("miliS").value
    miIntervalo = setInterval(minarAhora, nuevoTiempo);
    alert("TIempo de minado cambiado!!")
  }

let naniCoin = new BlockChain("info de genesiss","00");

showDivIniciales()



function Invervalo(){
    miIntervalo = setInterval(minarAhora, 300000);
}



Invervalo()


/*
naniCoin.addBlock("info del segundo bloque");
naniCoin.addBlock("info del tercer bloque");
textoBlockchain += "}"
console.log(JSON.stringify(naniCoin.chain,null,2))
console.log(naniCoin.isValid())
console.log(textoBlockchain)
*/

console.log(JSON.stringify(naniCoin.chain,null,2))
