import {Favorecido} from "../models/Favorecido.js";

class FavorecidoService{
    
    static async findAll(){
        const objs = await Favorecido.findAll({include: {all: true, nested: true}});
        return objs;
    }

    static async findByPk(req){
        const {id} = req.params;
        const obj = await Favorecido.findByPk(id, {include:{all: true, nested:true}});
        return obj;
    }

    static async create(req){
        const { nome, ramo, cpfOuCnpj, email } = req.body;
        const obj = await Favorecido.create({ nome, ramo, cpfOuCnpj, email });
        return await Favorecido.findByPk(obj.id, {include: {all: true, nested: true}});
    }

    static async update(req){
        const {id} = req.params;
        const { nome, ramo, cpfOuCnpj, email } = req.body;
        const obj =  await Favorecido.findByPk(id, {include: {all: true, nested: true}});
        if (obj == null) throw 'Favorecido Não encontrado';
        Object.assign(obj, { nome, ramo, cpfOuCnpj, email });
        return await obj.save;
    }

    static async delete(req){
        const {id} = req.params;
        const obj = await Favorecido.findByPk(id);
        if(obj == null) throw 'Favorecido Não Encontrado';
        try{
            await obj.destroy();
            return obj;
        }catch(error){
            throw "Não é Possivel remover um favorecido que tenha participação em transações."
        }
    }

}

export {FavorecidoService};