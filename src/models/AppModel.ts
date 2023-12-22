import { makeAutoObservable } from "mobx";

export class AppModel {
    constructor() {
        makeAutoObservable(this, {}, {autoBind: true})
    }

    
}