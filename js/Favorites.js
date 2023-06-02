import { GithubUser } from './Githubuser.js'

export class Favorites{
  constructor(root){
    this.root = document.querySelector(root)

    this.load()
  }

  load(){
    this. entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
  }

  save(){
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
  }

  async add(username){
    try{
      const userExists = this.entries.find(entry => entry.login === username)

      if(userExists){
        throw new Error('Usuário já favoritado!')
      }

      const user = await GithubUser.search(username)

      if(user.login === undefined){
        throw new Error('Usuário não encontrado!')
      }

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


export class FavoritesView extends Favorites{
  constructor(root){
    super(root)
  
    this.tbody = this.root.querySelector('table tbody')

    this.update()
    this.onadd()
    this.showOrHideNoFavorites()
  }

  showOrHideNoFavorites(){
    const noFavorites = this.root.querySelector('.no-favorites')
    
    if(this.entries == 0){
      noFavorites.classList.remove('hide')
    }else{
      noFavorites.classList.add('hide')
    }
  }

  onadd(){
    const favButton = this.root.querySelector('.search button')
    
    favButton.onclick = () => {
      const { value } =  this.root.querySelector('#search-input')

      this.add(value)
    }
  }

  update(){
    this.removeAllTr()

    this.entries.forEach(user => {
      const row = this.createRow()

      row.querySelector('.user a').href = `https://github.com/${user.login}`
      row.querySelector('.user a img').src = `https://github.com/${user.login}.png`
      row.querySelector('.user a p').textContent = `${user.name}`
      row.querySelector('.user a span').textContent = `/${user.login}`

      row.querySelector('.repos').textContent = `${user.public_repos}`
      row.querySelector('.followers').textContent = `${user.followers}`

      row.querySelector('.remove').onclick = () => {
        const isOk = confirm(`Remover ${user.name} dos Favoritos?`)

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