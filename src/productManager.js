import fs from 'fs'

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
export class ProductManager {

constructor(path) {
    this.path = path
    this.array = []
}

async getProduct () {
    try {
        return JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))
        
    } catch (error) {
        if (error) {
            console.log('error al leer el archivo');
            
        }
    }
}

async addProduct (title, description, price, thumbnail, code, stock) { 
    Product.prototype.id ;
    Product.prototype.status;
    let producto = new Product(title, description, price, thumbnail, code, stock)
    producto.id = modificarId()
    producto.status = true
    arrayProduct.push(producto)
    try {
    await fs.promises.writeFile(this.path, JSON.stringify(arrayProduct, null, 2));
} catch (error) {
    if (error) {
        console.log('error al añadir el producto');
    }
}
return producto

}

async getProductById (id) {
    try {
        let archivoGuardado = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))
        let productoEncontrado =  archivoGuardado.find(prod => prod.id === id)
        return productoEncontrado  
    } catch (error) {
        if (error) {
            console.log('el producto buscado por id no existe'); 
        }
    }
}

async updateProduct (id, campo, valor) {
    let arrayGuardar = await JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))
    let product = arrayGuardar.find(prod => prod.id === id)
    product[campo]  = valor;
    let nuevoArray = arrayGuardar.filter(prod => prod.id !== id)
    nuevoArray.push(product)
    try {
        fs.promises.writeFile(this.path, JSON.stringify(nuevoArray))
    } catch (error) {
        if (error) {
            console.log('error al actualizar el producto');
        }
    }
    
}

async deleteProduct (id) {
    let arrayLeido = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))
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

// ARRAY DONDE SE MUESTRAN LOS PRODUCTOS CREADOS
let arrayProduct = []


export const productosActuales = async () =>{
let pm = new ProductManager('../productos.json')
const arrayProds = await pm.getProduct()
return arrayProds;
}