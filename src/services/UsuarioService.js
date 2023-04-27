import {Usuario} from "../models/Usuario.js";

class UsuarioService{

    static async findAll(){
        const objs = await Usuario.findAll({include: {all: true, nested:true}});
        return objs;
    }

    static async findByPk(req){
        const {id} = req.params;
        const obj = await Usuario.findByPk(id, {include: {all: true, nested: true}});
        return obj;
    }

    static async create(req){
        const {usuario, senha, nome, cpf, email} = req.body;
        const obj = await Usuario.create({usuario, senha, nome, cpf, email});
        return await Usuario.findByPk(obj.id, {include: {all: true, nested: true}});

    }

    static async update(req){
        const {id} = req.params;
        const {usuario, senha, nome, cpf, email} = req.body;
        const obj = await Usuario.findByPk(id, {include: {all: true, nested: true}});
        if (obj == null) throw 'Usuario Não Encontrada.';
        Object.assign(obj, {usuario, senha, nome, cpf, email});
        return await obj.save;
    }

    static async delete(req){
        const {id} = req.params;
        const obj =  await Usuario.findByPk(id);
        if(obj == null) throw 'Usuario Não Encontrada';
        try{
            await obj.destroy();
            return obj;
        }catch(error){
            throw 'Não é possivel excluir uma Usuario que esteja em uso.';
        }
    }
}

export {UsuarioService};