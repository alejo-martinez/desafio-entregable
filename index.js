const fs = require('fs')
// CLASE PRODUCTO Y SU CONSTRUCTOR
class Product {
        constructor(title, description, price, thumbnail, code, stock) {
                this.title = title;
                this.description = description;
                this.price = price;
                this.thumbnail = thumbnail;
                this.code = code;
                this.stock = stock;
            }
        }

        let guardar
        // CONTADOR QUE MODIFICA EL ID
            let id = 0;
            const modificarId = () => {
            return id ++;
        }

       

        // CLASE PRODUCTMANAGER CON SUS METODOS
        class ProductManager {
            constructor(path) {
                this.path = path
                this.iniciar()
            }
            
            iniciar = async() => {
                await fs.promises.writeFile(this.path, JSON.stringify(arrayProduct))
            }

    getProduct = async ()=> {
            guardar = await fs.promises.readFile(this.path, 'utf-8')
            console.log(JSON.parse(guardar));
    }
    addProduct = async (title, description, price, thumbnail, code, stock) => {
        Product.prototype.id ;
        let producto = new Product(title, description, price, thumbnail, code, stock)
        producto.id = modificarId()
        arrayProduct.push(producto)
        await fs.promises.writeFile(this.path, JSON.stringify(arrayProduct))
    }
    getProductById (id) {
       let productoBuscado = arrayProduct.filter((prod) => prod.id === id)
             productoBuscado.length === 0 ? console.log("El id del producto que buscaste no existe") : console.log(productoBuscado);           
    }

    updateProduct (id, campo, valor) {
        let seleccionado = arrayProduct.find(prod => prod.id === id)
        seleccionado[campo] = valor
    }

    deleteProduct (id) {
        if (arrayProduct.find(prod => prod.id === id)) {
            arrayProduct = arrayProduct.filter(prod => prod.id !== id)
            console.log(arrayProduct);
        } else {
            console.log("no existe el producto");
        }
    }
}


// ARRAY DONDE SE MUESTRAN LOS PRODUCTOS CREADOS
let arrayProduct = []


// Instancia de la clase ProductManager
let productManager = new ProductManager('./productos.json')


productManager.getProduct()

productManager.addProduct("producto prueba", "Este es un producto prueba", 200, "sin imagen", "abc123", 25)

productManager.getProduct()