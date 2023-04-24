import {Tipo} from "../models/Tipo.js";

class TipoService{

    static async findAll(){
        const objs = await Tipo.findAll({include: {all: true, nested: true}});
        return objs;
    }
}

export {TipoService};