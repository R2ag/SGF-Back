import {TipoService} from "../services/TipoService.js"

class TipoController{

    static async findAll(req, res, next){
        TipoService.findAll()
            .then(objs => res.json(objs))
            .catch(next);
    }
}

export {TipoController};