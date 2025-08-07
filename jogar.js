import { select, number, input, confirm } from "@inquirer/prompts"
import chalk from "chalk"
import fs from "fs/promises"

const caminho = './historico.json'

// 🔹 NOVA FUNÇÃO: menu com nomes existentes e recordes
async function obterNomeDoJogador() {
    let historico = []

    try {
        const conteudo = await fs.readFile(caminho, 'utf8')
        historico = JSON.parse(conteudo)
    } catch {
        // nenhum histórico ainda
    }

    let nome

    if (historico.length > 0) {
        const escolha = await select({
            message: chalk.cyan("Selecione seu nome ou crie um novo:"),
            choices: [
                ...historico.map(j => ({
                    name: `${j.nome} ${chalk.gray(`(recorde: ${j.tentativas} tentativa${j.tentativas > 1 ? 's' : ''})`)}`,
                    value: j.nome
                })),
                { name: chalk.gray("➕ Usar um novo nome"), value: "__novo" }
            ]
        })

        if (escolha === "__novo") {
            nome = await input({ message: chalk.yellow("Digite seu novo nome:") })

            const confirmar = await confirm({
                message: chalk.yellow(`Deseja mesmo criar um novo registro para "${nome}"?`)
            })

            if (!confirmar) {
                console.log(chalk.gray("Registro cancelado."))
                return null
            }
        } else {
            nome = escolha
        }
    } else {
        nome = await input({ message: chalk.yellow("Digite seu nome:") })
    }

    return nome
}

// 🔹 SALVAR O RECORDE (sem mudanças)
export async function salvarSeForRecorde(nome, tentativas) {
    let historico = []

    try {
        const conteudo = await fs.readFile(caminho, 'utf8')
        historico = JSON.parse(conteudo)
    } catch {
        // arquivo ainda não existe
    }

    const recordeAtual = historico.find((jogador) => jogador.nome === nome)

    if (!recordeAtual) {
        const confirmar = await confirm({
            message: chalk.yellow(`⚠️  Esse nome ainda não tem nenhum registro. Deseja criar um novo registro para "${nome}"?`)
        })

        if (!confirmar) {
            console.log(chalk.gray("Registro cancelado."))
            return
        }
    }

    if (!recordeAtual || tentativas < recordeAtual.tentativas) {
        const novoRegistro = {
            nome,
            data: new Date().toISOString(),
            tentativas
        }

        const novoHistorico = historico.filter((j) => j.nome !== nome)
        novoHistorico.push(novoRegistro)

        await fs.writeFile(caminho, JSON.stringify(novoHistorico, null, 2))
        console.log(chalk.bold.greenBright("🏆 Novo recorde registrado!"))
    } else {
        console.log(chalk.italic.yellowBright("Você acertou, mas não bateu seu recorde."))
    }
}

// 🔹 JOGO PRINCIPAL
export async function jogar() {
    try {
        const nome = await obterNomeDoJogador()
        if (!nome) return

        const numeroAleatorio = Math.floor(Math.random() * 101)
        let numeroTentativas = 7
        let tentativasFeitas = 0

        while (numeroTentativas > 0) {
            let palpite = await number({ message: chalk.bold.yellow("Digite um número de 0 a 100:") })  
            tentativasFeitas++

            if (palpite === numeroAleatorio) {
                console.log(chalk.bold.green("\n🎉 Parabéns, você acertou!"))
                await salvarSeForRecorde(nome, tentativasFeitas)
                break
            } else if (palpite > numeroAleatorio) {
                console.log(chalk.bold.red("Muito alto!") + " " + chalk.italic.dim("Tente um número menor."))
            } else {
                console.log(chalk.bold.red("Muito baixo!") + " " + chalk.italic.dim("Tente um número maior."))
            }

            numeroTentativas--
        }

        if (numeroTentativas === 0) {
            console.log(chalk.bold.redBright(`\n💥 Tentativas acabaram! O número era ${numeroAleatorio}.`))
        }

    } catch {
        console.log(chalk.gray('Programa encerrado pelo usuário.'))
    }
}
