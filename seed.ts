import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function limparBanco() {
  // Limpar todas as transações
  await prisma.transaction.deleteMany({})

  // Limpar todas as contas
  await prisma.account.deleteMany({})

  // Limpar todos os usuários
  await prisma.user.deleteMany({})
}

async function main() {
  // Limpar o banco de dados
  await limparBanco()

  // Criar os usuários
  const user1 = await prisma.user.create({
    data: {
      name: 'Usuário 1',
      username: 'usuario1',
      passwordHashed: 'senha1',
      Accounts: {
        create: [
          { name: 'Conta 1', bank: 'Banco A', profit: 0 },
          { name: 'Conta 2', bank: 'Banco B', profit: 0 },
          { name: 'Conta 3', bank: 'Banco C', profit: 0 },
        ],
      },
    },
  })

  const user2 = await prisma.user.create({
    data: {
      name: 'Usuário 2',
      username: 'usuario2',
      passwordHashed: 'senha2',
      Accounts: {
        create: [
          { name: 'Conta 1', bank: 'Banco X', profit: 0 },
          { name: 'Conta 2', bank: 'Banco Y', profit: 0 },
          { name: 'Conta 3', bank: 'Banco Z', profit: 0 },
        ],
      },
    },
  })

  // Função para criar transações
  async function criarTransacoes(contaId: number, tipo: string) {
    for (let i = 1; i <= 5; i++) {
      await prisma.transaction.create({
        data: {
          title: `${tipo} ${i}`,
          description: `Descrição da ${tipo.toLowerCase()} ${i}`,
          type: tipo === 'Entrada' ? 'incomes' : 'outcomes',
          category: tipo === 'Entrada' ? 'Recebimento' : 'Despesa',
          value: tipo === 'Entrada' ? 200 : -100,
          date: new Date(),
          isDone: true,
          isFixed: false,
          isRepeated: false,
          origin: { connect: { id: contaId } },
        },
      })
    }
  }

  // Criar transações para cada conta de cada usuário
  const contasUsuario1 = await prisma.account.findMany({
    where: { username: user1.username },
  })

  const contasUsuario2 = await prisma.account.findMany({
    where: { username: user2.username },
  })

  for (const conta of contasUsuario1) {
    await criarTransacoes(conta.id, 'Entrada')
    await criarTransacoes(conta.id, 'Saída')
  }

  for (const conta of contasUsuario2) {
    await criarTransacoes(conta.id, 'Entrada')
    await criarTransacoes(conta.id, 'Saída')
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
