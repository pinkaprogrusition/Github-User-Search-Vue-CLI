<template>
      <div class="page-wrapper ">
        <div class="main-body">
            <div>
                <div class="alert alert-danger" role="alert"
                    v-if="queryParams.isError && queryParams.canLoad">
                    Failed to load data. Try to reload page
                </div>
                <div class="alert alert-success" role="alert"
                    v-if="queryParams.isError && !queryParams.canLoad">
                    All users are loaded
                </div>
            </div>
            <div class="input-group flex-nowrap">
                <span class="input-group-text" id="addon-wrapping">@</span>
                <input type="text" class="form-control" placeholder="Username" aria-label="Username" aria-describedby="addon-wrapping"
                    v-model="queryParams.username"
                    @input="onQueryParamsChange"
                    @keyup.enter="onEnterKeyPressed"
                >
                <button type="button" class="btn btn-dark"
                    @click="getAllUsers"
                >Find</button>
            </div>
            <div class="d-flex flex-row-reverse">
                <div class="p-2 centered-content">
                    <font-awesome-icon icon="fa-solid fa-arrow-down-wide-short" class="clickable" 
                        v-if="queryParams.sortBy == 'desc'"
                        @click="switchSortOrderType"
                    />
                    <font-awesome-icon icon="fa-solid fa-arrow-up-wide-short" class="clickable" 
                        v-else
                        @click="switchSortOrderType"/>
                </div>
                <div class="p-2 centered-content">
                    <p>Sort by repositories</p>
                </div>
            </div>
            <div class="tableList" @scroll="onScroll">
                <table class="table table-striped table-hover">
                    <thead>
                      <tr class="table-dark">
                        <th scope="col">#</th>
                        <th colspan="2" scope="col">Username</th>
                        <th scope="col"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="user in users" :key="user.id">
                        <td scope="row">{{ user.id }}</td>                        
                        <td colspan="2">{{ user.login }}</td>
                        <td>
                            <router-link :to="`/user/${user.login}`">
                                <font-awesome-icon icon="fa-solid fa-chevron-right" class="clickable"/>
                            </router-link>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <p v-if="users.length == 0">No users found</p>
                  <div class="d-flex justify-content-center" v-if="showLoader">
                    <div class="spinner-border" role="status">
                      <span class="visually-hidden">Loading...</span>
                    </div>
                  </div>
            </div>
        </div>
    </div>
</template>
  
  <script>
  export default {
    name: 'SearchComponent',
    props: {
    },
    data: function () {
        return {
            showLoader: false,
            queryParams:{
                username: "",
                sortBy: "desc",
                page: 1,

                needReload: true,
                isError: false,
                canLoad: true
            },
            users: []
        }
        },
    methods: {
        onEnterKeyPressed(){
            this.onQueryParamsChange()
            this.getAllUsers()
        },
        onScroll ({ target: { scrollTop, clientHeight, scrollHeight }}) {
            if (Math.ceil(scrollTop + clientHeight) >= scrollHeight) {
                this.queryParams.page ++;
                if(!this.showLoader) this.getAllUsers(this.queryParams.page)
            }
        },
        onQueryParamsChange(){
            this.queryParams.isError = false
            this.queryParams.canLoad = true
            this.queryParams.needReload = true
        },
        switchSortOrderType(){
            this.onQueryParamsChange()
            this.queryParams.sortBy = this.queryParams.sortBy == "desc" ? "asc" : "desc";
            this.getAllUsers()
        },
        getAllUsers(){
            console.log(this.queryParams.needReload)
            
            if(this.queryParams.isError) return;
            if(this.queryParams.username.trim() == "") return
            
            if(this.queryParams.needReload){
                this.users = []
                this.queryParams.page = 1
            }

            const t = this;
            this.showLoader = true
            let xhr = new XMLHttpRequest();
            xhr.open('GET', `https://api.github.com/search/users?q=${this.queryParams.username}&sort=repositories&order=${this.queryParams.sortBy}&per_page=100&page=${this.queryParams.page}`);
            xhr.send();
    
            xhr.onload = function() {
                if (xhr.status != 200) {
                    console.log(`Error: ${xhr.status}: ${xhr.statusText} : ${xhr.response}`); 
                    
                    if(xhr.status == 422) t.queryParams.canLoad = false
                    
                    t.showLoader = false;
                    t.queryParams.isError = true;
                } else {
                    try{
                        let message = JSON.parse(xhr.response)
                        t.users = [
                            ...t.users,
                            ...message.items
                        ]

                        t.$store.commit('setUsersList', t.users)

                        t.queryParams.needReload = false
                        t.showLoader = false
                    }
                    catch(err){
                        console.log(err)
                        t.showLoader = false
                        t.queryParams.isError = true
                    }
                }
            };
            xhr.onerror = () => {
                console.log("Failed to load");
                t.queryParams.isError = true
                t.showLoader = false
            }
        },
    },
    created(){
        this.getAllUsers()
    }
  }
  </script>
  <style scoped>
 .main-body{
    background-color: #fff;
    height: 100vh;
    width: 1040px;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr 1fr 10fr;
    padding: 8px;
    padding-top: 32px;
}
  </style>
  