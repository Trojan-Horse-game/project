<template>
  <v-app>
    <div id="container">
      <div id="background">
        <img src="Design/Rules.gif" usemap="#image-map" />
        <map name="image-map">
          <router-link to="/menuPrincipal">
            <area
              target="_self"
              alt="Retour au menu principal"
              title="Retour au menu principal"
              coords="618,723,795,790"
              shape="rect"
            />
          </router-link>
        </map>
      </div>

      <div id="regles">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris dui
        odio, tempor eu commodo a, sodales eget tortor. Proin suscipit turpis
        vel arcu ullamcorper, et maximus lacus venenatis. Nunc vehicula tellus
        at nisi mattis rhoncus. Integer quis bibendum magna, id sagittis justo.
        Nulla condimentum placerat ipsum, sed commodo eros dictum non. In
        posuere magna nec aliquam sagittis. Aenean ultricies ligula id
        scelerisque cursus. Fusce tempus nunc a augue hendrerit vestibulum.
        Curabitur at erat sit amet ligula hendrerit fermentum vel ac nisi. Donec
        eget eros tempus, laoreet tortor eget, dignissim dui. In eu venenatis
        mauris, eu mollis metus.
        <br /><br />
        Integer augue nunc, laoreet condimentum placerat nec, mollis sed libero.
        Aliquam sit amet elementum eros. In hac habitasse platea dictumst. Morbi
        vel sem in ligula congue sagittis. Donec consequat semper tempus.
        Interdum et malesuada fames ac ante ipsum primis in faucibus. Nunc
        venenatis nibh eu mi bibendum congue. Aenean erat quam, pulvinar quis
        molestie at, ultricies eu massa. Pellentesque habitant morbi tristique
        senectus et netus et malesuada fames ac turpis egestas. Aenean ut nisl
        eget turpis aliquet ornare. Suspendisse eu lacus accumsan, aliquet
        turpis et, ultricies dui. Curabitur non pulvinar nulla. Curabitur non
        urna et risus venenatis molestie. Sed in facilisis est. Morbi sed mi
        iaculis, pharetra leo tincidunt, faucibus erat. Mauris ultricies leo et
        nulla lobortis tristique.
      </div>
    </div>
  </v-app>
</template>

<style scoped>
#background img {
  width: 100%;
  height: 100%;
  z-index: -1;
}

#regles {
  width: 497px;
  height: 540px;
  top: 156px;
  left: 459px;
  z-index: 0;
  overflow-y: scroll;
  color: #171717;
  padding: 5px 10px;
}

#container {
  position: relative;
}

#regles {
  position: absolute;
}
</style>
