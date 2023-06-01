import { GithubUser } from './Githubuser.js'

//classe para lógica
export class Favorites{
  constructor(root){
    this.root = document.querySelector(root)

    this.load()
  }

  load(){
    this.entries = JSON.parse(localStorage.getItem('@github-favorites-challenge:')) || []
    this.showOrHideNoFavorites()
  }

  save(){
    localStorage.setItem('@github-favorites-challenge:', JSON.stringify(this.entries))
  }

  async add(username){
    try{
      const userExists = this.entries.find(entry => entry.login === username)

      if(userExists){
        throw new Error('Usuário não encontrado!')
      }

      const user = await GithubUser.search(username)

      this.entries = [user, ...this.entries]

      this.update()
      this.save()
      this.showOrHideNoFavorites()
    }
    catch(Error){
      alert(Error.message)
    }
  }

  delete(user){
    const filteredEntries = this.entries.filter(entry => entry.login !== user.login)

    this.entries = filteredEntries

    this.update()
    this.save()
    this.showOrHideNoFavorites()
  }
}

//classe para visualizar e eventos
export class FavoritesView extends Favorites{
  constructor(root){
    super(root)

    this.tbody = this.root.querySelector('table tbody')
    
    this.update()
    this.onadd()
  }

  showOrHideNoFavorites(){
    const entriesIsEmpty = this.entries
    const noFavorites = this.root.querySelector('.no-favorites') 

    if(entriesIsEmpty == 0){
      noFavorites.classList.remove('hide')
    }else{
      noFavorites.classList.add('hide')
    }
  }

  onadd(){
    const favButton = this.root.querySelector('.search button')
    favButton.onclick = () => {
      const {value} = this.root.querySelector('#search-input')
      this.add(value)
    }
  }

  update(){
    this.removeAllTr()

    this.entries.forEach(user => {
      const row = this.createRow()
  
      row.querySelector('.user a').href = `https://github.com/${user.login}`
      row.querySelector('.user a img').src = `https://github.com/${user.login}.png`
      row.querySelector('.user a img').alt = `Imagem de ${user.login}`
      row.querySelector('.user p').textContent = `${user.name}`
      row.querySelector('.user span').textContent = `/${user.login}`

      row.querySelector('.repos').textContent = `${user.public_repos}`
      row.querySelector('.followers').textContent = `${user.followers}`

      row.querySelector('.remove')
      row.querySelector('.remove').onclick = () => {
        const isOk = confirm(`Remover ${user.name} dos favoritos?`)

        if(isOk){
          this.delete(user)
        }
      }
  
      this.tbody.appendChild(row)
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
        <button class="remove">
          <i class="ph ph-x"></i>
        </button>
      </td>
    `
    return tr
  }

  removeAllTr(){
    this.tbody.querySelectorAll('tr').forEach(tr => tr.remove())
  }
}