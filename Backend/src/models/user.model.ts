
// FALTA CREAR LA LÓGICA PARA ACCEDER A LA BASE DE DATOS

export class UserModel {
    

    static async getAllUsers() {
        return
    }


    static async createUser(data: object) {
        return data
    }


    static async updateUser(id: string, data: object) {
        return [id, data]
    }


    static async deleteUser( id: string ) {
        return id
    }   
}