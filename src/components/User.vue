<template>
   <div class="page-wrapper text-bg-light" id="app">
        <div class="main-body">
            <div>
              <div class="alert alert-danger" role="alert"
                  v-if="isError && canLoad">
                  Failed to load data. Try to reload page
              </div>
            </div>
            <div class="d-flex flex-row">
                <div class="p-2 centered-content">
                  <router-link to="/">
                    <font-awesome-icon icon="fa-solid fa-chevron-left" class="clickable"/>
                  </router-link>
                </div>
                <div class="p-2 centered-content">
                  <router-link to="/" class="link-underline-light">
                    <p>Find a user</p>
                  </router-link>
                </div>
            </div>
            <hr/>
            <div class="logo-section centered-content">
              <img :src="user.avatar_url" alt="">
            </div>
            <div class="username-section centered-content">
              <h6>{{ user.login }}</h6>
            </div>
            <div class="username-section centered-content">
              <p>Repositories: {{ $store.state.count }}</p>
            </div>
            <div class="tableList">
              <div v-if="repos.length == 0" class="centered-content">
                <p>No repositories found</p>
              </div>
              <table class="table table-striped table-hover">
                <tbody>
                  <tr v-for="repo in repos" :key="repo.id">
                    <td colspan="2">{{ repo.name }}</td>
                    <td>
                      <a :href="repo.html_url">
                        <font-awesome-icon icon="fa-solid fa-chevron-right" class="clickable"/>
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table> 
            </div>
            <div class="centered-content">
              <a :href="user.html_url">
                <button type="button" class="btn btn-dark">Go to GitHub</button>
              </a>
            </div>
          </div>
        <div v-show="showLoader"
          class="full-screen-loader centered-content">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'UserComponent',
  props: {
  },
  data: function () {
      return {
        showLoader: false,
        canLoad: true,
        isError: false,
        
        repos: [],
        user: {
            login: "",
            avatar_url: "",
            reposURL: "",
            githubURL: ""
        }
      }
    },
    methods: {
        getUserInfo(){
            const t = this;
            this.showLoader = true

            let xhr = new XMLHttpRequest();
            xhr.open('GET', `https://api.github.com/users/${this.user.login}`);
            xhr.send();
    
            xhr.onload = function() {
                if (xhr.status != 200) {
                    console.log(`Error: ${xhr.status}: ${xhr.statusText} : ${xhr.response}`); 
            
                    t.showLoader = false;
                    t.isError = true;
                } else {
                    try{
                        let message = JSON.parse(xhr.response)
                        t.user = message

                        t.getUserRepos()
                    }
                    catch(err){
                        console.log(err)
                        t.showLoader = false
                        t.isError = true
                    }
                }
            };
    
            xhr.onerror = () => {
                console.log("Failed to load");
                t.isError = true
                t.showLoader = false
            }
        },
        getUserRepos(){
            const t = this;
            this.showLoader = true
            let xhr = new XMLHttpRequest();
            xhr.open('GET', `https://api.github.com/users/${this.user.login}/repos`);
            xhr.send();
    
            xhr.onload = function() {
                if (xhr.status != 200) {
                    console.log(`Error: ${xhr.status}: ${xhr.statusText} : ${xhr.response}`); 
                    t.showLoader = false;
                    t.isError = true;
                } else {
                    try{
                        let message = JSON.parse(xhr.response)
                        t.repos = message
                        t.showLoader = false
                    }
                    catch(err){
                        console.log(err)
                        t.showLoader = false
                        t.isError = true
                    }
                }
            };
    
            xhr.onerror = () => {
                console.log("Failed to load");
                t.isError = true
                t.showLoader = false
            }
        }
    },
    created(){
        this.user.login = this.$route.params.username
        let user = this.$store.getters.getUserByUsername(this.user.login)

        if(user == undefined) this.getUserInfo()
        else this.user = this.$store.getters.getUserByUsername(this.user.login)       
        
        this.getUserRepos()
    }
}
</script>
<style scoped>
.main-body{
    background-color: #fff;
    height: 100%;
    width: 360px;
    padding: 8px;
    padding-top: 32px;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr auto 100px 1fr 1fr 10fr 1fr;
}
.content{
    height: 100%;
    width: 100%;
}

.column-section-1{
    background-color: red;
    width: 100%;
}

.column-section-2{
    background-color: blue;
    width: 100%;
}
.logo-section img{
    width: 80px;
    height: 80px;
    border-radius: 50%;
}

</style>
