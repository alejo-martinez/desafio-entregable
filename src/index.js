import fs from 'fs'

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
export class ProductManager {

    constructor(path) {
        this.path = path
        this.array = []
    }
    
    // async iniciar() {
    //     try {
    //         await fs.promises.writeFile(this.path, JSON.stringify(this.array), (err) => {
    //             if (err) {
    //                 console.log(err);
    //             }
    //         })
            
    //     } catch (error) {
    //         if (error) {
    //             console.log('error al escribir el archivo al iniciar');
    //         }
    //     }
    // }
    async getProduct () {
        try {
            return JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))
            // guardar = JSON.parse(guardar)
            // console.log(guardar);
            
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

// const productManager = new ProductManager('../productos.json')
// async function ejecutarMetodos() {
//     await productManager.iniciar()
    // await productManager.getProduct()
//     await productManager.addProduct("Arroz", "Arroz integral TRIMACER", 200, "sin imagen", "abc123", 10)
//     await productManager.getProduct()
//     await productManager.addProduct("Batatas", "Verduras de primera calidad", 150, "sin imagen", "abc123", 50)
//     await productManager.addProduct("Cereales", "Cereales en oferta", 350, "sin imagen", "abc1234", 24)
//     await productManager.addProduct("Pan", "Pan recien horneado", 125, "sin imagen", "abc143", 12)
//     await productManager.addProduct("Leche", "Leche descremada", 110, "sin imagen", "abc223", 115)
//     await productManager.addProduct("Yogurt", "Yogurt entero", 300, "sin imagen", "abc1235", 75)
//     await productManager.addProduct("Sprite", "Bebida sprite 2L", 500, "sin imagen", "abc1236", 12)
//     await productManager.addProduct("Agua saborizada", "Agua saborizada sin gas LEVITE", 115, "sin imagen", "abc1237", 17)
//     await productManager.addProduct("Queso cremoso", "Queso cremoso light LA PAULINA", 137, "sin imagen", "abc523", 65)
//     await productManager.addProduct("Tomate", "Tomates de primera calidad", 210, "sin imagen", "abc183", 82)
//     await productManager.getProduct()
// }

// ARRAY DONDE SE MUESTRAN LOS PRODUCTOS CREADOS
let arrayProduct = []

// await ejecutarMetodos()

// module.exports = ProductManager