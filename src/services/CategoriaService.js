import {Categoria} from "../models/Categoria.js"

class CategoriaService{
    static async findAll(){
        const objs = await Categoria.findAll({include: {all: true, nested: true}});
        return objs;
    }

    static async findByPk(req){
        const {id} = req.params;
        const obj = await Categoria.findByPk(id, {include: {all: true, nested: true}});
        return obj;
    }

    static async create(req){
        const {nome, tipo, descricao, observacao} = req.body;
    }
}