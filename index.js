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
        this.array = []
    }
    
    async iniciar() {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(this.array), (err) => {
                if (err) {
                    console.log(err);
                }
            })
            
        } catch (error) {
            if (error) {
                console.log('error al escribir el archivo al iniciar');
            }
        }
    }
    async getProduct () {
        try {
            guardar = await fs.promises.readFile(this.path, 'utf-8')
            console.log(JSON.parse(guardar));
            
        } catch (error) {
            if (error) {
                console.log('error al leer el archivo');
            }
        }
    }

    async addProduct (title, description, price, thumbnail, code, stock) {
        Product.prototype.id ;
        let producto = new Product(title, description, price, thumbnail, code, stock)
        producto.id = modificarId()
        arrayProduct.push(producto)
        try {
        await fs.promises.writeFile(this.path, JSON.stringify(arrayProduct, null, 2));
    } catch (error) {
        if (error) {
            console.log('error al añadir el producto');
        }
    }
    }
    async getProductById (id) {
        try {
            let archivoGuardado = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))
            let productoEncontrado =  archivoGuardado.find(prod => prod.id === id)
            productoEncontrado? console.log(productoEncontrado):console.log('el producto buscado por id no existe');     
        } catch (error) {
            if (error) {
                console.log(error);
            }
        }
    }

    async updateProduct (id, campo, valor) {
        let product = arrayProduct.find(prod => prod.id === id)
        product[campo] = valor;
        let nuevoArray = arrayProduct.filter(prod => prod.id !== id)
        nuevoArray.push(product)
        try {
            fs.promises.writeFile(this.path, JSON.stringify(nuevoArray))
        } catch (error) {
            if (error) {
                console.log(error);
            }
        }
        
    }

    async deleteProduct (id) {
        let arrayLeido = await fs.promises.readFile(this.path, 'utf-8')
        arrayLeido = JSON.parse(arrayLeido)
        let encontrado = arrayLeido.find(prod => prod.id === id)
        if (encontrado) {
            let borrarProd = arrayLeido.filter(prod => prod.id !== id)
            try {
                await fs.promises.writeFile(this.path, JSON.stringify(borrarProd))
            } catch (error) {
                if (error) {
                    console.log(error);
                }
        }   
        } else {
            console.log("el producto ya fue borrado o no existe");
        }
    }
}

async function ejecutarMetodos() {
    const productManager = new ProductManager('./productos.json')
    await productManager.iniciar()
    await productManager.getProduct()
    
    await productManager.addProduct("producto prueba", "Este es un producto prueba", 200, "sin imagen", "abc123", 25)
    await productManager.getProduct()
    await productManager.getProductById(2)
    await productManager.updateProduct(0, 'description', 'cambiando la descripcion del producto')
    await productManager.deleteProduct(3)
}

// ARRAY DONDE SE MUESTRAN LOS PRODUCTOS CREADOS
let arrayProduct = []

ejecutarMetodos()