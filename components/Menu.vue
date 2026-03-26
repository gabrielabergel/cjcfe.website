<template>
  <div class="menu">
    <NuxtLink to="/" class="menu_logo">
      <img src="/images/Logo-Notre-Historia.svg" loading="lazy" alt="" class="menu_logo_image">
    </NuxtLink>
    <div class="menu_nav">
      <div class="menu_icon" @click="toggleMenu">
        <img src="/images/Menu.svg" loading="lazy" alt="">
      </div>
    </div>
    <div class="menu_offset" :style="{ display: menuOpen ? 'flex' : 'none' }">
      <div class="menu_close" @click="closeMenu"></div>
      <div class="menu_offset_wrapper">
        <div class="menu_cross_wrapper">
          <div class="menu_cross" @click="closeMenu">
            <div class="list_plus_line is-white"></div>
            <div class="list_plus_line is-vertical is-white"></div>
          </div>
        </div>
        <NuxtLink to="/notre-histoire" class="menu_link" @click="closeMenu">
          <div>Notre histoire</div>
        </NuxtLink>
        <NuxtLink to="/qui-sommes-nous" class="menu_link" @click="closeMenu">
          <div>Qui sommes-nous ?</div>
        </NuxtLink>
        <NuxtLink to="/articles" class="menu_link" @click="closeMenu">
          <div>Actualités</div>
        </NuxtLink>
        <NuxtLink to="/infos-pratiques" class="menu_link" @click="closeMenu">
          <div>Infos pratiques</div>
        </NuxtLink>
        <NuxtLink to="/contact" class="menu_link is-last" @click="closeMenu">
          <div>Contact</div>
        </NuxtLink>
        <div class="menu_offset_legals">
          <NuxtLink to="/mentions-legales" target="_blank" class="menu_link--legals" @click="closeMenu">Mentions légales</NuxtLink>
          <NuxtLink to="/protection-des-donnees" target="_blank" class="menu_link--legals" @click="closeMenu">Protection des données</NuxtLink>
          <NuxtLink to="/engagement" target="_blank" class="menu_link--legals" @click="closeMenu">Engagement</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const menuOpen = ref(false)

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}

const closeMenu = () => {
  menuOpen.value = false
}
</script>

<style lang="scss">
// Menu Component Styles
.menu {
  z-index: 900;
  width: var(--100);
  max-width: 2400px;
  display: flex;
  position: fixed;
  inset: 0% auto auto;
}

.menu_logo {
  background-color: var(--blue);
  justify-content: center;
  align-items: center;
  width: auto;
  margin-left: 0;
  padding-left: 20px;
  padding-right: 20px;
  display: flex;
}

.menu_nav {
  grid-column-gap: var(--15);
  grid-row-gap: var(--15);
  background-color: var(--blue);
  height: 60px;
  margin-left: auto;
  padding: 10px 20px;
  display: flex;
}

.menu_icon {
  height: var(--100);
  background-color: var(--blue);
  width: 40px;
  cursor: pointer;
}

.menu_offset {
  z-index: 900;
  text-transform: uppercase;
  flex-flow: row;
  width: 100%;
  display: none;
  position: fixed;
  inset: 0% 0% 0% auto;
}

.menu_link {
  width: var(--100);
  padding: var(--10) var(--20);
  border-top: 1px solid var(--white);
  color: var(--white);
  text-transform: uppercase;
  font-size: 18px;
  text-decoration: none;
  transition: background-color .3s;

  &:hover {
    background-color: var(--beige);
  }

  &.is-last {
    border-bottom: 1px solid var(--white);
  }
}

.menu_offset_legals {
  display: flex;
  flex-flow: column;
  gap: 5px;
  width: var(--100);
  padding: var(--20) var(--20);
  color: var(--white);
  font-size: 14px;
  text-decoration: none;
  text-transform: none;
  margin-top: auto;
}

.menu_link--legals {
  color: var(--white);
  text-decoration: none;
}

.menu_close {
  padding-top: var(--20);
  padding-bottom: var(--10);
  background-color: #00000080;
  justify-content: flex-end;
  align-items: center;
  width: 60%;
  height: 100vh;
  display: flex;
}

.menu_offset_wrapper {
  background-color: var(--blue);
  flex-flow: column;
  justify-content: flex-start;
  align-items: flex-end;
  width: 40%;
  height: 100vh;
  font-size: 18px;
  display: flex;
}

.menu_cross {
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  font-size: 21px;
  display: flex;
  transform: rotate(45deg);
  cursor: pointer;
}

.menu_cross_wrapper {
  width: var(--100);
  padding-right: var(--20);
  justify-content: flex-end;
  align-items: center;
  height: 60px;
  display: flex;
}

// Media queries
@media screen and (max-width: 991px) {
  .menu {
    background-color: var(--blue);
    justify-content: space-between;
    align-items: center;
    height: 60px;
  }

  .menu_logo {
    height: var(--100);
    width: auto;
    margin-left: 0%;
  }

  .menu_nav {
    margin-left: 0;
  }

  .menu_logo_image {
    height: 20px;
  }

  .menu_offset_wrapper {
    width: 100%;
  }

  .menu_close {
    display: none;
  }
}

@media screen and (max-width: 479px) {
  .menu_logo {
    padding-left: 10px;
    padding-right: 10px;
  }

  .menu_nav {
    justify-content: flex-end;
    align-items: center;
    width: auto;
    min-width: auto;
    padding-left: 10px;
    padding-right: 10px;
  }

  .menu_logo_image {
    height: 15px;
  }
}
</style>
