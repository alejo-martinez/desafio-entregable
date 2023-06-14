export default class ProductDTO {
    constructor(titulo, descripcion, precio, ruta, codigo, stock, owner) {
        this.title = titulo;
        this.description = descripcion;
        this.price = precio;
        this.thumbnail = ruta;
        this.code = codigo;
        this.stock = stock;
        this.status = true;
        this.owner = owner;
    }
}