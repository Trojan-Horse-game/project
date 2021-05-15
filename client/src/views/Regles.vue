<template>
  <v-app>
    <div id="background-image" />
    <div id="logo">
      <img src="logo.png" alt="Logo du jeu" />
    </div>
    <div id="container" :class="w<1024 ? 'portrait' : 'paysage'">
        <span id="titre">RÈGLES DU JEU</span>

      <div id="content" v-if="w<1024">
          <img id="portrait" src="../../public/Design/v1.png" v-if="this.count==1"/>
          <img id="portrait" src="../../public/Design/v2.png" v-if="this.count==2"/>
          <img id="portrait" src="../../public/Design/v3.png" v-if="this.count==3"/>
          <img id="portrait" src="../../public/Design/v4.png" v-if="this.count==4"/>
          <img id="portrait" src="../../public/Design/v5.png" v-if="this.count==5"/>
          <img id="portrait" src="../../public/Design/v6.png" v-if="this.count==6"/>
          <img id="portrait" src="../../public/Design/v7.png" v-if="this.count==7"/>
          <img id="portrait" src="../../public/Design/v8.png" v-if="this.count==8"/>
          <img id="portrait" src="../../public/Design/v9.png" v-if="this.count==9"/>
          <img id="portrait" src="../../public/Design/v10.png" v-if="this.count==10"/>
          <img id="portrait" src="../../public/Design/v11.png" v-if="this.count==11"/>
          <img id="portrait" src="../../public/Design/v12.png" v-if="this.count==12"/>
      </div>
      <div id="content" v-if="w>1024">
          <img id="paysage" src="../../public/Design/h1.png" v-if="this.count==1"/>
          <img id="paysage" src="../../public/Design/h2.png" v-if="this.count==2"/>
          <img id="paysage" src="../../public/Design/h3.png" v-if="this.count==3"/>
          <img id="paysage" src="../../public/Design/h4.png" v-if="this.count==4"/>
          <img id="paysage" src="../../public/Design/h5.png" v-if="this.count==5"/>
          <img id="paysage" src="../../public/Design/h6.png" v-if="this.count==6"/>
          <img id="paysage" src="../../public/Design/h7.png" v-if="this.count==7"/>
          <img id="paysage" src="../../public/Design/h8.png" v-if="this.count==8"/>
          <img id="paysage" src="../../public/Design/h9.png" v-if="this.count==9"/>
          <img id="paysage" src="../../public/Design/h10.png" v-if="this.count==10"/>
          <img id="paysage" src="../../public/Design/h11.png" v-if="this.count==11"/>
          <img id="paysage" src="../../public/Design/h12.png" v-if="this.count==12"/>
      </div>
      <div id="cont">
        <div id="boutons">
            <button id="prev" @click="prev()" />
            <button id="retour"
              @click="$router.go(-1)"/>
            <button id="next" @click="next()" />
          </div>
        </div>
      </div>
  </v-app>
</template>

<script lang="ts">
export default {
  data: () => ({
    length: 12,
    count: 1,
    w: window.outerWidth,
  }),
  computed: {},
  methods: {
    next() {
      if (this.count == 12)  
        this.count = 1
      else this.count++;
    },
    prev() {
      if (this.count == 1)  
        this.count = 12
      else this.count--;
    }
  },
  created: function() {
    if (localStorage.getItem("token") === null) {
      this.$router.push("/");
    }
  }
};

</script>
<style lang="scss" scoped>
$textColor: #bbbbbb;
$content: #2f363c;

#background-image {
  background-image: url("../../public/Design/fond_parametres.gif");
}

#container {
  height: 100%;
  margin: auto;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

}

.portrait {
  width: 90%;
}

.portrait #titre {
  font-size: 300%;
}

.paysage {
  width: 50%;
}

#portrait, #paysage {
  width:inherit;
}

#logo {
  width: 20%;
  position: fixed;
  top: 1%;
  left: 1%;
  margin-right: 5%;
}

#logo img {
  width: 100% !important;
  height: auto;
}

#content {
  width: 100%;
  height: max-content;
  padding: 2%;
  z-index: 0;
  color: $textColor;
  background-color: $content;
  display: flex;
  flex-direction: column;
  align-content: space-around;
  align-items: center;
  font-size: 25px;
  justify-content: space-around;
  margin: 2% 0%;
}

#titre {
  font-size: 400%;
  color: $textColor;
  text-align: center;
}

#boutons {
  padding: 20px 0px 0px 0px;
  display: flex;
  justify-content: space-around;
  
  /*justify-items; space;*/
  //margin-left: auto;
  //margin-right: auto; 
}


#prev {
  background-image: url("../../public/Design/prev.png");
}

#next {
  background-image: url("../../public/Design/next.png");
}

#retour {
  background-image: url("../../public/Design/retour.png");
}

#prev,
#next {
  width: 71px;
  background-size: contain;
}

#prev,
#next,
#retour {
  height: 71px;
}

#retour {
  width: 178px;
  background-size: contain;
}

#cont {
  width: 35vw;
  display: flex;
  flex-direction: column;
  height: 100%;
}

</style>
<style lang="css" src="../assets/scss/index.css"></style>
