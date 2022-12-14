
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

        // CONTADOR QUE MODIFICA EL ID
            let id = 0;
            const modificarId = () => {
            return id ++;
        }


        // CLASE PRODUCTMANAGER CON SUS METODOS
        class ProductManager {
    getProduct () {
       console.log(arrayProduct);
    }
    addProduct(title, description, price, thumbnail, code, stock) {
        let duplicado = arrayProduct.filter(prod => prod.code === code)
        if (duplicado.length !== 0) {
            console.log("El codigo ingresado ya está en uso");
        } else {
            Product.prototype.id ;
            let producto = new Product(title, description, price, thumbnail, code, stock)
            producto.id = modificarId() ;
            arrayProduct.push(producto)
        }
    }

    getProductById (id) {
       let productoBuscado = arrayProduct.filter((prod) => prod.id === id)
             productoBuscado.length === 0 ? console.log("El id del producto que buscaste no existe") : console.log(productoBuscado);           
    }
}


// ARRAY DONDE SE MUESTRAN LOS PRODUCTOS CREADOS
let arrayProduct = []

// Instancia de la clase ProductManager
let productManager = new ProductManager


productManager.getProduct()

productManager.addProduct("producto prueba", "Este es un producto prueba", 200, "sin imagen", "abc123", 25)

productManager.getProduct()

productManager.addProduct("producto prueba", "Este es un producto prueba", 200, "sin imagen", "abc13", 25)

productManager.getProductById(5)