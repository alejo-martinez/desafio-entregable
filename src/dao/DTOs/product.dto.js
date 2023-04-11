export default class ProductDTO {
    constructor(titulo, descripcion, precio, thumbnail, codigo, stock) {
        this.title = titulo;
        this.description = descripcion;
        this.price = precio;
        this.thumbnail = thumbnail;
        this.code = codigo;
        this.stock = stock;
        this.status = true;
    }
}