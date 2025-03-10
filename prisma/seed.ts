import { PrismaClient } from '.prisma/client'

const client = new PrismaClient()

async function main() {
  for (const item of [...Array.from(Array(500).keys())]) {
    await client.stream.create({
      data: {
        name: String(item),
        price: +String(item),
        desc: String(item),
        cloudflareId: '',
        cloudflareUrl: '',
        cloudflareKey: '',
        user: {
          connect: {
            id: 1,
          },
        },
      },
    })
  }
}

main()
  .catch((e) => console.log(e))
  .finally(() => client.$disconnect())
