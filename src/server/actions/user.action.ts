"use server";

import { db } from "../db";


export const getUser = (id: string) => {
    const user = db.user.findFirst({where: { id }});
    return user;
}

export const updateUser = (id: string, data: { name: string, email: string }) => {
    const user = db.user.update({
        where: {id},
        data: {...data}
    })

    return user
}