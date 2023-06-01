import { GithubUser } from './Githubuser.js'

export class Favorites{
    constructor(root){
        this.root = document.querySelector(root)
        this.load()
    }

    load(){
        this.entries = JSON.parse(localStorage.getItem('@github-favorites2:')) || [{login: "lucaslirah"}]
    }

    save(){
        localStorage.setItem('@github-favorites2:')
    }

    delete(user){
        const filteredEntries = this.entries.filter(entry => user.login !== entry.login)
        this.entries = filteredEntries
        this.update()
    }
}

export class FavoritesView extends Favorites{
    constructor(root){
        super(root)

        this.tbody = this.root.querySelector('table tbody')
        GithubUser.search('lucaslirah')

        this.update()
    }

    update(){
        this.removeAllTr()

        this.entries.forEach(user => {
            const row = this.createRow()
    
            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user a').href = `https://github.com/${user.login}`
            row.querySelector('.user p').textContent = `${user.name}`
            row.querySelector('.user span').textContent = `/${user.login}`
            row.querySelector('.repos').textContent = `${user.repositories}`
            row.querySelector('.followers').textContent = `${user.followers}`

            row.querySelector('.remove').onclick = () => {
                const isOk = confirm('Deletar este usuário dos favoritos?')
                if(isOk){
                    this.delete(user)
                }
            }

            this.tbody.appendChild(row)
        })

    }

    removeAllTr(){
        this.tbody.querySelectorAll('tr').forEach(tr => {
            tr.remove()
        })
    }

    createRow(){
        const tr = document.createElement('tr')
        tr.innerHTML = `
            <td class="user">
                <a href="https://github.com/lucaslirah" target="_blank">
                    <img src="https://github.com/lucaslirah.png" alt="Imagem de Lucas Lira">
                    <div>
                    <p>Lucas Lira</p>
                    <span>/lucaslirah</span>
                    </div>
                </a>
            </td>
            <td class="repos">
                123
            </td>
            <td class="followers">
                1234
            </td>
            <td>
                <button class="remove">Remover</button>
            </td>
        `
        return tr
    }
}