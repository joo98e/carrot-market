import { PrismaClient } from '.prisma/client'

const client = new PrismaClient()

async function main() {
    
  ;[...Array.from(Array(500).keys())].forEach(async (item, idx) => {
    await client.stream.create({
      data: {
        name: String(item),
        price: +String(item),
        desc: String(item),
        user: {
          connect: {
            id: 27,
          },
        },
      },
    })

    console.log(`${idx}/500`)
  })
}

main()
  .catch((e) => console.log(e))
  .finally(() => client.$disconnect())
