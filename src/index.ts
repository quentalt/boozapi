import {Elysia, t} from 'elysia'
import {PrismaClient} from '@prisma/client'
import {swagger} from '@elysiajs/swagger'
import bcrypt from 'bcrypt'

const db = new PrismaClient()

const app = new Elysia()
    .use(swagger())
    .post(
        '/user',
        async ({ body }) => {
            const password = await bcrypt.hash(body.password, 10)
            return db.user.create({
                data: {
                    username: body.username,
                    password
                },
                select: {
                    id: true,
                    username: true
                }
            })
},
        {
            error({ code }) {
                switch (code) {
                    case 'NOT_FOUND':
                        return {
                            error: 'Username must be unique'
                        }
                }
            },
            body: t.Object({
                username: t.String(),
                password: t.String({
                    minLength: 8
                })
            }),
            response: t.Object({
                id: t.Number(),
                username: t.String()
            })
        }
    ).post(
        '/boisson',
        async ({ body }) =>
            db.boisson.create({
                data: body,
                select: {
                    id: true,
                    nom: true,
                    prix: true,
                    description: true,
                    image: true,
                    type: true,
                    quantite: true,
                    degre: true,
                    volume: true,
                    pays: true,
                    marque: true
                }
            }),
        {
            body: t.Object({
                nom: t.String(),
                prix: t.Number(),
                description: t.String(),
                image: t.String(),
                type: t.String(),
                quantite: t.Number(),
                degre: t.Number(),
                volume: t.Number(),
                pays: t.String(),
                marque: t.String()
            }),
            response: t.Object({
                id: t.Number(),
                nom: t.String()
            })
        }
    ).get(
        '/boisson',
        async () => db.boisson.findMany(),
        {
            response: t.Array(
                t.Object({
                    id: t.Number(),
                    nom: t.String()
                })
            )
        }

    ).get(
        '/boisson/:id',
        async ({ params }) => {
            return db.boisson.findUnique({
            where: {
                id: Number(params.id)
            }
        })
        },
    ).put(
        '/boisson/:id',
        async ({ params, body }) => db.boisson.update({
            where: {
                id: Number(params.id)
            },
            data: body,
            select: {
                id: true,
                nom: true
            }
        }),
        {
            params: t.Object({
                id: t.String()
            }),
            body: t.Object({
                nom: t.String(),
                prix: t.Number()
            }),
            response: t.Object({
                id: t.Number(),
                nom: t.String()
            })
        }
    ).delete(
        '/boisson/:id',
        async ({ params }) => db.boisson.delete({
            where: {
                id: Number(params.id)
            }
        }),
        {
            params: t.Object({
                id: t.String()
            }),
            response: t.Object({
                id: t.Number(),
                nom: t.String()
            })
        }
    ).listen(3000)

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)