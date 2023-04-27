import {Categoria} from "../models/Categoria.js";

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
        const {nome, descricao, observacao, tipo} = req.body;
        if(tipo == null) throw 'O tipo da categoria deve ser informado!';
        const obj = await Categoria.create({nome, descricao, observacao, tipoId: tipo.id});
        return await Categoria.findByPk(obj.id, {include: {all: true, nested: true}});
    }

    static async update(req){
        const {id} = req.params;
        const {nome, descricao, observacao, tipo} = req.body;
        const obj = await Categoria.findByPk(id, {include: {all: true, nested: true}});
        if (obj == null) throw 'Categoria Não encontrada';
        Object.assign(obj, {nome, descricao, observacao, tipoId: tipo.id});
        return await obj.save; 
    }

    static async delete(req){
        const {id} = req.params;
        const obj =  await Categoria.findByPk(id);
        if(obj == null) throw 'Categoria Não Encontrada';
        try{
            await obj.destroy();
            return obj;
        }catch(error){
            throw 'Não é possivel excluir uma categoria que esteja em uso.';
        }
    }
}

export {CategoriaService};